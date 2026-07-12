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
  getProgressColor,
  getUrgencyColor,
  getDocTypeLabel,
  getDocTypeClasses,
} from "@/lib/helpers";
import { ArrowLeft, Calendar, Clock, Plus, ExternalLink, FileText, Image } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function TaskDetailPage() {
  const { lang, pageParams, tasks, setTasks, documents, navigate } = useApp();

  const task = tasks.find((tk) => tk.id === pageParams.taskId);
  if (!task) {
    return <div className="p-8 text-center text-muted-foreground">Task not found</div>;
  }

  const p = getTaskProgress(task);
  const u = getUrgency(task.deadline);
  const doneSteps = task.steps.filter((s) => s.done).length;
  const linkedDocs = documents.filter((d) => task.docs.includes(d.id));

  const toggleStep = (stepId: string) => {
    setTasks((prev) =>
      prev.map((tk) => {
        if (tk.id !== task.id) return tk;
        const updatedSteps = tk.steps.map((s) =>
          s.id === stepId ? { ...s, done: !s.done } : s
        );
        const allDone = updatedSteps.every((s) => s.done);
        const anyDone = updatedSteps.some((s) => s.done);
        return {
          ...tk,
          steps: updatedSteps,
          status: allDone ? "completed" : anyDone ? "in_progress" : "todo",
        };
      })
    );
  };

  const updateStatus = (status: string) => {
    setTasks((prev) =>
      prev.map((tk) => {
        if (tk.id !== task.id) return tk;
        return {
          ...tk,
          status: status as "todo" | "in_progress" | "completed",
          steps: status === "completed" ? tk.steps.map((s) => ({ ...s, done: true })) : tk.steps,
        };
      })
    );
    toast.success(`${task.key}: Status updated`);
  };

  const statusOptions = ["todo", "in_progress", "completed"] as const;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto animate-fade-in">
      <Button
        variant="ghost"
        size="sm"
        className="mb-5 -ml-2"
        onClick={() => navigate("tasks")}
      >
        <ArrowLeft className="w-4 h-4" />
        {t("backToTasks", lang)}
      </Button>

      {/* Header */}
      <Card className="p-6 mb-4">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-mono text-muted-foreground">{task.key}</span>
              <span className={`cat-tag ${getCategoryClass(task.category)}`}>
                {getCategoryLabel(task.category, lang)}
              </span>
            </div>
            <h1 className="text-2xl font-semibold">{task.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Select value={task.status} onValueChange={updateStatus}>
              <SelectTrigger className="w-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {t(s === "in_progress" ? "inProgress" : s, lang)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="font-medium" style={{ color: getUrgencyColor(u) }}>
              {formatDeadline(task.deadline, lang)}
            </span>
            <span className="text-muted-foreground">
              ({formatDate(task.deadline, lang)})
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Created {formatDate(task.createdAt, lang)}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{task.description}</p>
      </Card>

      {/* Missing docs warning */}
      {linkedDocs.length === 0 && task.steps.some((s) => {
        const m = s.desc.toLowerCase();
        return m.includes("pay") || m.includes("id") || m.includes("passport") || m.includes("address");
      }) && (
        <div className="section-message section-message-warning mb-4">
          <svg className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--color-dz-warning)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <path d="M12 9v4"/>
            <path d="M12 17h.01"/>
          </svg>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#693200" }}>
              {t("missingDoc", lang)}
            </p>
          </div>
        </div>
      )}

      {/* Steps */}
      <Card className="p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{t("steps", lang)}</h2>
          <div className="flex items-center gap-2">
            <div className="progress-bar w-32">
              <div
                className="progress-fill"
                style={{ width: `${p}%`, background: getProgressColor(p) }}
              />
            </div>
            <span className="text-sm font-semibold" style={{ color: getProgressColor(p) }}>
              {doneSteps}/{task.steps.length} ({p}%)
            </span>
          </div>
        </div>
        <div className="space-y-1">
          {task.steps.map((s, i) => (
            <div
              key={s.id}
              className="flex items-start gap-3 p-3 rounded-md hover:bg-muted transition-colors group"
            >
              <div
                className={`step-check mt-0.5 ${s.done ? "done" : ""}`}
                onClick={() => toggleStep(s.id)}
              >
                {s.done && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${s.done ? "line-through text-muted-foreground" : ""}`}>
                  {s.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
              </div>
              <span className="text-xs text-muted-foreground font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Linked Documents */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {t("linkedDocs", lang)} ({linkedDocs.length})
          </h2>
          <Button variant="ghost" size="sm">
            <Plus className="w-3.5 h-3.5" />
            {t("addDoc", lang)}
          </Button>
        </div>
        {linkedDocs.length ? (
          <div className="space-y-2">
            {linkedDocs.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-muted transition-colors"
              >
                <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center shrink-0">
                  {d.name.endsWith(".pdf") ? (
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Image className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{d.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`cat-tag ${getDocTypeClasses(d.type)}`}>
                      {getDocTypeLabel(d.type, lang)}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{d.size}</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-sm text-muted-foreground">
            {t("noDocuments", lang)}
          </div>
        )}
      </Card>
    </div>
  );
}
