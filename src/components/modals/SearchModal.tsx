"use client";

import { useState, useEffect, useRef } from "react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/i18n";
import { getCategoryClass, getCategoryLabel } from "@/lib/helpers";
import { Search, CheckSquare, Copy, File } from "lucide-react";

interface SearchModalProps {
  onClose: () => void;
}

export function SearchModal({ onClose }: SearchModalProps) {
  const { lang, tasks, documents, navigate } = useApp();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const q = query.toLowerCase();
  const matchedTasks = tasks.filter(
    (tk) =>
      !q ||
      tk.title.toLowerCase().includes(q) ||
      tk.key.toLowerCase().includes(q) ||
      tk.category.includes(q)
  );
  const matchedDocs = documents.filter(
    (d) =>
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.type.toLowerCase().includes(q)
  );

  const handleNavigate = (page: "task-detail" | "documents", params?: Record<string, string>) => {
    onClose();
    navigate(page, params);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(5, 12, 31, 0.46)" }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-background rounded-xl border border-border w-full max-w-lg overflow-hidden" style={{ boxShadow: "0px 8px 12px rgba(30,31,33,0.15), 0px 0px 1px rgba(30,31,33,0.31)" }}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 border-none outline-none text-sm bg-transparent"
            placeholder={`${t("search", lang)} tasks, templates, documents...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded font-mono text-muted-foreground bg-muted">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {!query && !matchedTasks.length && !matchedDocs.length ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Start typing to search...
            </div>
          ) : (
            <>
              {matchedTasks.length > 0 && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground">
                    {t("tasks", lang)}
                  </div>
                  {matchedTasks.slice(0, 4).map((tk) => (
                    <div
                      key={tk.id}
                      className="px-4 py-2 flex items-center gap-3 hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => handleNavigate("task-detail", { taskId: tk.id })}
                    >
                      <CheckSquare className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium">{tk.key}</span>
                        <span className="text-sm text-muted-foreground ml-2">{tk.title}</span>
                      </div>
                      <span className={`cat-tag ${getCategoryClass(tk.category)}`}>
                        {getCategoryLabel(tk.category, lang)}
                      </span>
                    </div>
                  ))}
                </>
              )}
              {matchedDocs.length > 0 && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground">
                    {t("documents", lang)}
                  </div>
                  {matchedDocs.slice(0, 3).map((d) => (
                    <div
                      key={d.id}
                      className="px-4 py-2 flex items-center gap-3 hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => handleNavigate("documents")}
                    >
                      <File className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-sm">{d.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{d.size}</span>
                    </div>
                  ))}
                </>
              )}
              {!matchedTasks.length && !matchedDocs.length && (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No results found
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
