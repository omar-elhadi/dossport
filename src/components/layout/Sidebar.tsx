"use client";

import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckSquare,
  Copy,
  Folder,
  Settings,
} from "lucide-react";
import { Page } from "@/types";

const navItems: { page: Page; icon: React.ElementType; labelKey: string }[] = [
  { page: "dashboard", icon: LayoutDashboard, labelKey: "dashboard" },
  { page: "tasks", icon: CheckSquare, labelKey: "tasks" },
  { page: "templates", icon: Copy, labelKey: "templates" },
  { page: "documents", icon: Folder, labelKey: "documents" },
  { page: "settings", icon: Settings, labelKey: "settings" },
];

export function Sidebar() {
  const { lang, currentPage, sidebarOpen, setSidebarOpen, navigate, user } = useApp();

  const isActive = (page: Page) => {
    if (currentPage === page) return true;
    if (currentPage === "task-detail" && page === "tasks") return true;
    if (currentPage === "template-detail" && page === "templates") return true;
    return false;
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ background: "rgba(5, 12, 31, 0.46)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-[240px] bg-background border-r border-border flex flex-col transition-transform duration-200 z-40",
          "md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                <path d="m9 15 2 2 4-4"/>
              </svg>
            </div>
            <span className="text-base font-bold">
              <span className="text-foreground">Dossier</span>
              <span className="text-primary">Zen</span>
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.page}
                onClick={() => navigate(item.page)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-all text-sm font-medium border border-transparent",
                  isActive(item.page)
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-[18px] h-[18px]" />
                <span>{t(item.labelKey, lang)}</span>
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-border">
          <button
            onClick={() => navigate("settings")}
            className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <div className="text-sm font-semibold truncate">{user.name}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
