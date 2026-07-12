"use client";

import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/i18n";
import {
  getUrgency,
  formatDeadline,
  getTaskProgress,
  getCategoryClass,
  getCategoryLabel,
  getStatusBadge,
  getProgressColor,
  getUrgencyColor,
} from "@/lib/helpers";
import { Layers, Activity, AlertTriangle, CheckCircle2, Plus, Copy, Upload, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DashboardPage() {
  const { lang, user, tasks, navigate } = useApp();

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12
      ? lang === "fr"
        ? "Bonjour"
        : t("goodMorning", lang)
      : hour < 18
        ? lang === "fr"
          ? "Bon après-midi"
          : "Good afternoon"
        : lang === "fr"
          ? "Bonsoir"
          : "Good evening";

  const dateStr = now.toLocaleDateString(
    lang === "fr" ? "fr-FR" : "en-US",
    { weekday: "long", month: "long", day: "numeric", year: "numeric" }
  );

  const total = tasks.length;
  const active = tasks.filter((tk) => tk.status === "in_progress").length;
  const urgent = tasks.filter((tk) => {
    const u = getUrgency(tk.deadline);
    return u === "urgent" || u === "critical" || u === "late";
  }).length;
  const completedCount = tasks.filter((tk) => tk.status === "completed").length;

  const upcoming = tasks
    .filter((tk) => tk.status !== "completed")
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  const recent = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const statCards = [
    { icon: Layers, label: t("totalTasks", lang), value: total, semantic: "information" },
    { icon: Activity, label: t("activeTasks", lang), value: active, semantic: "discovery" },
    { icon: AlertTriangle, label: t("urgentTasks", lang), value: urgent, semantic: "danger" },
    { icon: CheckCircle2, label: t("completedMonth", lang), value: completedCount, semantic: "success" },
  ];

  const semanticColors: Record<string, { bg: string; icon: string }> = {
    information: { bg: "var(--color-dz-information-bg)", icon: "var(--color-dz-information)" },
    discovery: { bg: "var(--color-dz-discovery-bg)", icon: "var(--color-dz-discovery)" },
    danger: { bg: "var(--color-dz-danger-bg)", icon: "var(--color-dz-danger)" },
    success: { bg: "var(--color-dz-success-bg)", icon: "var(--color-dz-success)" },
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">{greeting}, {user.name.split(" ")[0]}</h1>
        <p className="text-muted-foreground text-sm mt-1 capitalize">{dateStr}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const colors = semanticColors[stat.semantic];
          return (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-md flex items-center justify-center"
                  style={{ background: colors.bg }}
                >
                  <Icon className="w-[18px] h-[18px]" style={{ color: colors.icon }} />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-5 gap-6 mb-8">
        {/* Upcoming deadlines */}
        <Card className="lg:col-span-3 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t("upcomingDeadlines", lang)}</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("tasks")}>
              {t("all", lang)} →
            </Button>
          </div>
          {upcoming.length ? (
            <div className="space-y-1">
              {upcoming.map((tk) => {
                const u = getUrgency(tk.deadline);
                const p = getTaskProgress(tk);
                return (
                  <div
                    key={tk.id}
                    className="flex items-center gap-3 p-2.5 rounded-md hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => navigate("task-detail", { taskId: tk.id })}
                  >
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: getUrgencyColor(u) }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">{tk.key}</span>
                        <span className={`cat-tag ${getCategoryClass(tk.category)}`}>
                          {getCategoryLabel(tk.category, lang)}
                        </span>
                      </div>
                      <p className="text-sm font-medium truncate mt-0.5">{tk.title}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold" style={{ color: getUrgencyColor(u) }}>
                        {formatDeadline(tk.deadline, lang)}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{p}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">{t("noTasks", lang)}</div>
          )}
        </Card>

        {/* Recent tasks */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t("recentTasks", lang)}</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("tasks")}>
              {t("all", lang)} →
            </Button>
          </div>
          <div className="space-y-2">
            {recent.map((tk) => {
              const p = getTaskProgress(tk);
              const { className: badgeClass, label: badgeLabel } = getStatusBadge(tk.status, lang);
              return (
                <div
                  key={tk.id}
                  className="p-3 rounded-md border border-border hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => navigate("task-detail", { taskId: tk.id })}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono text-muted-foreground">{tk.key}</span>
                    <span className={`lozenge ${badgeClass}`}>{badgeLabel}</span>
                  </div>
                  <p className="text-sm font-medium mb-2">{tk.title}</p>
                  <div className="flex items-center gap-2">
                    <div className="progress-bar flex-1">
                      <div
                        className="progress-fill"
                        style={{ width: `${p}%`, background: getProgressColor(p) }}
                      />
                    </div>
                    <span className="text-[11px] text-muted-foreground font-medium">{p}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="p-5">
        <h2 className="text-lg font-semibold mb-4">{t("quickActions", lang)}</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate("dashboard")}>
            <Plus className="w-4 h-4" />
            {t("newTask", lang)}
          </Button>
          <Button variant="outline" onClick={() => navigate("templates")}>
            <Copy className="w-4 h-4" />
            {t("browseTemplates", lang)}
          </Button>
          <Button variant="outline" onClick={() => navigate("documents")}>
            <Upload className="w-4 h-4" />
            {t("uploadDoc", lang)}
          </Button>
        </div>
      </Card>
    </div>
  );
}
