"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Lang, Page, TaskFilter, Task, Document, Notification } from "@/types";
import { TASKS as INITIAL_TASKS, DOCUMENTS as INITIAL_DOCUMENTS, NOTIFICATIONS as INITIAL_NOTIFICATIONS } from "@/lib/data";

interface AppState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  pageParams: Record<string, string>;
  setPageParams: (params: Record<string, string>) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user: { name: string; email: string };
  taskFilter: TaskFilter;
  setTaskFilter: (filter: Partial<TaskFilter>) => void;
  templateFilter: string;
  setTemplateFilter: (filter: string) => void;
  docFilter: string;
  setDocFilter: (filter: string) => void;
  docSearch: string;
  setDocSearch: (search: string) => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  documents: Document[];
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  navigate: (page: Page, params?: Record<string, string>) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [pageParams, setPageParams] = useState<Record<string, string>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [documents] = useState<Document[]>(INITIAL_DOCUMENTS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [taskFilter, setTaskFilterState] = useState<TaskFilter>({
    status: "all",
    category: "all",
    sort: "newest",
    search: "",
  });
  const [templateFilter, setTemplateFilter] = useState("all");
  const [docFilter, setDocFilter] = useState("all");
  const [docSearch, setDocSearch] = useState("");

  const user = { name: "Alex Martin", email: "alex@example.com" };

  const setTaskFilter = useCallback((filter: Partial<TaskFilter>) => {
    setTaskFilterState((prev) => ({ ...prev, ...filter }));
  }, []);

  const navigate = useCallback((page: Page, params: Record<string, string> = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    setSidebarOpen(false);
  }, []);

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        currentPage,
        setCurrentPage,
        pageParams,
        setPageParams,
        sidebarOpen,
        setSidebarOpen,
        user,
        taskFilter,
        setTaskFilter,
        templateFilter,
        setTemplateFilter,
        docFilter,
        setDocFilter,
        docSearch,
        setDocSearch,
        tasks,
        setTasks,
        documents,
        notifications,
        setNotifications,
        navigate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
