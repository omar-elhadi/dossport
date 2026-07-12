"use client";

import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/i18n";
import { getNotifColor } from "@/lib/helpers";
import { Menu, Search, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header({ onOpenSearch }: { onOpenSearch: () => void }) {
  const {
    lang,
    setLang,
    currentPage,
    sidebarOpen,
    setSidebarOpen,
    pageParams,
    tasks,
    notifications,
    setNotifications,
    navigate,
  } = useApp();

  const breadcrumbMap: Record<string, string> = {
    dashboard: t("dashboard", lang),
    tasks: t("tasks", lang),
    "task-detail": t("tasks", lang),
    templates: t("templates", lang),
    "template-detail": t("templates", lang),
    documents: t("documents", lang),
    settings: t("settings", lang),
  };

  let breadcrumb = (
    <span className="text-muted-foreground">{breadcrumbMap[currentPage] || ""}</span>
  );

  if (currentPage === "task-detail") {
    const task = tasks.find((tk) => tk.id === pageParams.taskId);
    if (task) {
      breadcrumb = (
        <>
          <span
            className="text-muted-foreground cursor-pointer hover:text-foreground"
            onClick={() => navigate("tasks")}
          >
            {t("tasks", lang)}
          </span>
          <span className="text-muted-foreground mx-1.5">/</span>
          <span className="text-foreground">{task.title}</span>
        </>
      );
    }
  }

  if (currentPage === "template-detail") {
    breadcrumb = (
      <>
        <span
          className="text-muted-foreground cursor-pointer hover:text-foreground"
          onClick={() => navigate("templates")}
        >
          {t("templates", lang)}
        </span>
        <span className="text-muted-foreground mx-1.5">/</span>
        <span className="text-foreground">{pageParams.templateId}</span>
      </>
    );
  }

  const hasUnread = notifications.some((n) => !n.read);

  const toggleLang = () => {
    setLang(lang === "en" ? "fr" : "en");
  };

  return (
    <header className="h-14 bg-background border-b border-border flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden p-1.5 rounded-md hover:bg-muted transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="text-sm text-muted-foreground">{breadcrumb}</div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors text-muted-foreground text-sm"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">{t("search", lang)}</span>
          <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded font-mono bg-muted text-muted-foreground">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              if (hasUnread) {
                setNotifications(notifications.map((n) => ({ ...n, read: true })));
              }
            }}
            className="p-2 rounded-md hover:bg-muted transition-colors relative"
          >
            <Bell className="w-[18px] h-[18px] text-muted-foreground" />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
            )}
          </button>
        </div>

        {/* Language toggle */}
        <button
          onClick={toggleLang}
          className="p-2 rounded-md hover:bg-muted transition-colors text-sm font-bold text-muted-foreground"
          title="Switch language"
        >
          {lang.toUpperCase()}
        </button>
      </div>
    </header>
  );
}
