"use client";

import { useState } from "react";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { AuthScreen } from "@/components/pages/AuthScreen";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardPage } from "@/components/pages/DashboardPage";
import { TasksPage } from "@/components/pages/TasksPage";
import { TaskDetailPage } from "@/components/pages/TaskDetailPage";
import { TemplatesPage } from "@/components/pages/TemplatesPage";
import { TemplateDetailPage } from "@/components/pages/TemplateDetailPage";
import { DocumentsPage } from "@/components/pages/DocumentsPage";
import { SettingsPage } from "@/components/pages/SettingsPage";
import { CreateTaskModal } from "@/components/modals/CreateTaskModal";
import { toast } from "sonner";

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const { currentPage } = useApp();

  if (!isAuthenticated) {
    return <AuthScreen onAuth={() => setIsAuthenticated(true)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "tasks":
        return <TasksPage />;
      case "task-detail":
        return <TaskDetailPage />;
      case "templates":
        return <TemplatesPage />;
      case "template-detail":
        return <TemplateDetailPage />;
      case "documents":
        return <DocumentsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <AppShell>
      {renderPage()}
      {showCreateTask && (
        <CreateTaskModal onClose={() => setShowCreateTask(false)} />
      )}
    </AppShell>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <div className="h-full">
        <AppContent />
      </div>
    </AppProvider>
  );
}
