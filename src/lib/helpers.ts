import { Urgency, Category, DocType, Lang, Task, NotificationType } from "@/types";
import { t } from "./i18n";

export function getUrgency(deadline: string): Urgency {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(deadline);
  d.setHours(0, 0, 0, 0);
  const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "late";
  if (diff <= 3) return "critical";
  if (diff <= 7) return "urgent";
  return "normal";
}

export function formatDeadline(dateStr: string, lang: Lang): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0)
    return `Overdue by ${Math.abs(diff)} ${Math.abs(diff) === 1 ? t("day", lang) : t("days", lang)}`;
  if (diff === 0) return t("today", lang);
  if (diff === 1) return t("tomorrow", lang);
  return `${diff} ${diff === 1 ? t("day", lang) : t("days", lang)}`;
}

export function formatDate(dateStr: string, lang: Lang): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getTaskProgress(task: Task): number {
  if (!task.steps.length) return 0;
  return Math.round(
    (task.steps.filter((s) => s.done).length / task.steps.length) * 100
  );
}

export function getCategoryClass(cat: Category | string): string {
  return "cat-" + (cat || "other");
}

export function getCategoryLabel(cat: Category | string, lang: Lang): string {
  return t(cat, lang) || cat;
}

export function getStatusBadge(status: string, lang: Lang): { className: string; label: string } {
  const map: Record<string, [string, string]> = {
    todo: ["lozenge-neutral", t("toDo", lang)],
    in_progress: ["lozenge-information", t("inProgress", lang)],
    completed: ["lozenge-success", t("completed", lang)],
    urgent: ["lozenge-warning", "Urgent"],
    critical: ["lozenge-danger", "Critical"],
    late: ["lozenge-danger", t("overdue", lang)],
  };
  const [className, label] = map[status] || ["lozenge-neutral", status];
  return { className, label };
}

export function getProgressColor(p: number): string {
  if (p === 100) return "var(--color-dz-success)";
  if (p >= 50) return "var(--color-dz-brand)";
  if (p > 0) return "var(--color-dz-warning)";
  return "var(--border)";
}

export function getUrgencyColor(u: Urgency): string {
  return (
    {
      normal: "var(--color-dz-text-subtle)",
      urgent: "var(--color-dz-warning)",
      critical: "var(--color-dz-danger)",
      late: "var(--color-dz-danger)",
    }[u] || "var(--color-dz-text-subtle)"
  );
}

export function getUrgencyLozenge(u: Urgency): string {
  return (
    {
      normal: "lozenge-neutral",
      urgent: "lozenge-warning",
      critical: "lozenge-danger",
      late: "lozenge-danger",
    }[u] || "lozenge-neutral"
  );
}

export function getDocTypeLabel(type: DocType | string, lang: Lang): string {
  return t(type, lang) || type;
}

export function getDocTypeClasses(type: DocType | string): string {
  const m: Record<string, string> = {
    paySlip: "cat-crous",
    idDoc: "cat-cpam",
    proofAddress: "cat-ants",
    bankDetails: "cat-tax",
    civilStatus: "cat-prefecture",
    taxDoc: "cat-tax",
  };
  return m[type] || "cat-other";
}

export function getNotifColor(type: NotificationType): { icon: string; bg: string } {
  const colorMap: Record<NotificationType, string> = {
    danger: "var(--color-dz-danger)",
    warning: "var(--color-dz-warning)",
    information: "var(--color-dz-information)",
    success: "var(--color-dz-success)",
  };
  const bgMap: Record<NotificationType, string> = {
    danger: "var(--color-dz-danger-bg)",
    warning: "var(--color-dz-warning-bg)",
    information: "var(--color-dz-information-bg)",
    success: "var(--color-dz-success-bg)",
  };
  return { icon: colorMap[type], bg: bgMap[type] };
}
