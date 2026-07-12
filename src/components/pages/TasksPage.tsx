"use client";

import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/i18n";
import {
  getUrgency,
  formatDeadline,
  formatDate,
  getTaskProgress,
  getCategoryClass,
  getCategoryLabel,
  getStatusBadge,
  getProgressColor,
  getUrgencyColor,
} from "@/lib/helpers";
import { Plus, Search, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TasksPage() {
  const { lang, tasks, taskFilter, setTaskFilter, navigate } = useApp();

  let filtered = [...tasks];

  if (taskFilter.status !== "all") {
    if (taskFilter.status === "overdue") {
      filtered = filtered.filter((tk) => getUrgency(tk.deadline) === "late");
    } else {
      filtered = filtered.filter((tk) => tk.status === taskFilter.status);
    }
  }
  if (taskFilter.category !== "all") {
    filtered = filtered.filter((tk) => tk.category === taskFilter.category);
  }
  if (taskFilter.search) {
    const q = taskFilter.search.toLowerCase();
    filtered = filtered.filter(
      (tk) =>
        tk.title.toLowerCase().includes(q) ||
        tk.key.toLowerCase().includes(q)
    );
  }

  if (taskFilter.sort === "oldest") {
    filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else if (taskFilter.sort === "deadlineAsc") {
    filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  } else if (taskFilter.sort === "deadlineDesc") {
    filtered.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
  } else {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const categories = [...new Set(tasks.map((tk) => tk.category))];

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">{t("tasks", lang)}</h1>
      </div>

      {/* Filters */}
      <Card className="p-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={taskFilter.status}
            onValueChange={(val) => setTaskFilter({ status: val })}
          >
            <SelectTrigger className="w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all", lang)} — {t("status", lang).toLowerCase()}</SelectItem>
              <SelectItem value="todo">{t("toDo", lang)}</SelectItem>
              <SelectItem value="in_progress">{t("inProgress", lang)}</SelectItem>
              <SelectItem value="completed">{t("completed", lang)}</SelectItem>
              <SelectItem value="overdue">{t("overdue", lang)}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={taskFilter.category}
            onValueChange={(val) => setTaskFilter({ category: val })}
          >
            <SelectTrigger className="w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all", lang)} — {t("category", lang).toLowerCase()}</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {getCategoryLabel(c, lang)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={taskFilter.sort}
            onValueChange={(val) => setTaskFilter({ sort: val })}
          >
            <SelectTrigger className="w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t("newest", lang)}</SelectItem>
              <SelectItem value="oldest">{t("oldest", lang)}</SelectItem>
              <SelectItem value="deadlineAsc">{t("deadlineAsc", lang)}</SelectItem>
              <SelectItem value="deadlineDesc">{t("deadlineDesc", lang)}</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex-1 min-w-[180px] relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder={`${t("search", lang)}...`}
              value={taskFilter.search}
              onChange={(e) => setTaskFilter({ search: e.target.value })}
            />
          </div>
        </div>
      </Card>

      {/* Task list */}
      <div className="space-y-2">
        {filtered.length ? (
          filtered.map((tk) => {
            const p = getTaskProgress(tk);
            const u = getUrgency(tk.deadline);
            const doneSteps = tk.steps.filter((s) => s.done).length;
            const { className: badgeClass, label: badgeLabel } = getStatusBadge(tk.status, lang);
            return (
              <Card
                key={tk.id}
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => navigate("task-detail", { taskId: tk.id })}
              >
                <div className="shrink-0">
                  <div className={`step-check ${tk.status === "completed" ? "done" : ""}`}>
                    {tk.status === "completed" && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{tk.key}</span>
                    <span className={`cat-tag ${getCategoryClass(tk.category)}`}>
                      {getCategoryLabel(tk.category, lang)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold truncate">{tk.title}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="progress-bar w-24">
                      <div
                        className="progress-fill"
                        style={{ width: `${p}%`, background: getProgressColor(p) }}
                      />
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {doneSteps}/{tk.steps.length} {t("steps", lang).toLowerCase()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-semibold" style={{ color: getUrgencyColor(u) }}>
                      {formatDeadline(tk.deadline, lang)}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {formatDate(tk.deadline, lang)}
                    </p>
                  </div>
                  <span className={`lozenge ${badgeClass}`}>{badgeLabel}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-12 text-center">
            <p className="text-sm text-muted-foreground">{t("noTasks", lang)}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
