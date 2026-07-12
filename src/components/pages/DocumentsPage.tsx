"use client";

import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/i18n";
import {
  formatDate,
  getDocTypeLabel,
  getDocTypeClasses,
} from "@/lib/helpers";
import { UploadCloud, Search, FileText, Image, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function DocumentsPage() {
  const { lang, documents, tasks, docFilter, setDocFilter, docSearch, setDocSearch, navigate } = useApp();

  const docTypes = ["all", ...new Set(documents.map((d) => d.type))];
  let filtered = [...documents];

  if (docFilter !== "all") {
    filtered = filtered.filter((d) => d.type === docFilter);
  }
  if (docSearch) {
    const q = docSearch.toLowerCase();
    filtered = filtered.filter((d) => d.name.toLowerCase().includes(q));
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">{t("documents", lang)}</h1>
        <Button onClick={() => toast.info("File upload dialog would open here")}>
          <UploadCloud className="w-4 h-4" />
          {t("uploadDoc", lang)}
        </Button>
      </div>

      {/* Upload zone */}
      <Card
        className="p-8 mb-6 text-center cursor-pointer transition-colors border-dashed border-2"
        onClick={() => toast.info("File upload dialog would open here")}
      >
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <UploadCloud className="w-6 h-6 text-primary" />
        </div>
        <p className="text-sm font-medium">{t("dropFiles", lang)}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {t("pdf", lang)}, {t("image", lang)} — Max 10 MB
        </p>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex flex-wrap gap-1.5">
          {docTypes.map((dt) => (
            <Button
              key={dt}
              variant={docFilter === dt ? "default" : "outline"}
              size="sm"
              onClick={() => setDocFilter(dt)}
            >
              {dt === "all" ? t("allTypes", lang) : getDocTypeLabel(dt, lang)}
            </Button>
          ))}
        </div>
        <div className="flex-1 min-w-[180px] relative ml-auto">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder={`${t("search", lang)}...`}
            value={docSearch}
            onChange={(e) => setDocSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Document list */}
      <div className="space-y-2">
        {filtered.length ? (
          filtered.map((d) => {
            const linkedTasks = tasks.filter((tk) => tk.docs.includes(d.id));
            return (
              <Card key={d.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0">
                  {d.name.endsWith(".pdf") ? (
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Image className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{d.name}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className={`cat-tag ${getDocTypeClasses(d.type)}`}>
                      {getDocTypeLabel(d.type, lang)}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{d.size}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {formatDate(d.uploadedAt, lang)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {linkedTasks.length ? (
                    linkedTasks.map((tk) => (
                      <span
                        key={tk.id}
                        className="text-[11px] font-mono text-muted-foreground px-2 py-0.5 rounded cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors bg-muted"
                        onClick={() => navigate("task-detail", { taskId: tk.id })}
                      >
                        {tk.key}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-muted-foreground">—</span>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-12 text-center">
            <p className="text-sm text-muted-foreground">{t("noDocuments", lang)}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
