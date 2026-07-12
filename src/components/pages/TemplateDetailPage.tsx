"use client";

import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/i18n";
import { getCategoryClass, getCategoryLabel } from "@/lib/helpers";
import { TEMPLATES } from "@/lib/data";
import { ArrowLeft, ExternalLink, File, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function TemplateDetailPage() {
  const { lang, pageParams, tasks, setTasks, navigate } = useApp();

  const template = TEMPLATES.find((tp) => tp.id === pageParams.templateId);
  if (!template) {
    return <div className="p-8 text-center text-muted-foreground">Template not found</div>;
  }

  const createFromTemplate = () => {
    const newId = String(Date.now());
    const keyNum = tasks.length + 1;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 30);
    const newTask = {
      id: newId,
      key: `DZ-${keyNum}`,
      title: template.title,
      titleFr: template.titleFr,
      description: template.description,
      category: template.category,
      status: "todo" as const,
      deadline: deadline.toISOString().split("T")[0],
      createdAt: new Date().toISOString().split("T")[0],
      steps: template.steps.map((s, i) => ({
        id: "ns" + newId + i,
        title: s.title,
        desc: s.desc,
        done: false,
      })),
      docs: [],
    };
    setTasks((prev) => [newTask, ...prev]);
    navigate("task-detail", { taskId: newId });
    toast.success(`Task created from "${template.title}"`);
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto animate-fade-in">
      <Button
        variant="ghost"
        size="sm"
        className="mb-5 -ml-2"
        onClick={() => navigate("templates")}
      >
        <ArrowLeft className="w-4 h-4" />
        {t("templates", lang)}
      </Button>

      <Card className="p-6 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
              <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
            </svg>
          </div>
          <div>
            <span className={`cat-tag ${getCategoryClass(template.category)} mb-1`}>
              {getCategoryLabel(template.category, lang)}
            </span>
            <h1 className="text-2xl font-semibold">{template.title}</h1>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{template.description}</p>
        {template.officialLink && (
          <a
            href={template.officialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary font-medium mt-3 hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {t("officialLink", lang)}
          </a>
        )}
      </Card>

      {/* Steps */}
      <Card className="p-6 mb-4">
        <h2 className="text-lg font-semibold mb-4">
          {t("templateSteps", lang)} ({template.steps.length})
        </h2>
        <div className="space-y-3">
          {template.steps.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 text-xs font-bold text-muted-foreground">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-medium">{s.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Required docs */}
      <Card className="p-6 mb-4">
        <h2 className="text-lg font-semibold mb-4">{t("requiredDocs", lang)}</h2>
        <div className="flex flex-wrap gap-2">
          {template.requiredDocs.map((d, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-muted-foreground bg-muted"
            >
              <File className="w-3.5 h-3.5" />
              {d}
            </span>
          ))}
        </div>
      </Card>

      <Button className="w-full py-3 text-[15px]" onClick={createFromTemplate}>
        <Plus className="w-4 h-4" />
        {t("createFromTemplate", lang)}
      </Button>
    </div>
  );
}
