"use client";

import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/i18n";
import { getCategoryClass, getCategoryLabel } from "@/lib/helpers";
import { TEMPLATES } from "@/lib/data";
import {
  Home,
  HeartPulse,
  Receipt,
  Car,
  Landmark,
  GraduationCap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  home: Home,
  "heart-pulse": HeartPulse,
  receipt: Receipt,
  car: Car,
  landmark: Landmark,
  "graduation-cap": GraduationCap,
};

export function TemplatesPage() {
  const { lang, templateFilter, setTemplateFilter, navigate } = useApp();

  const categories = ["all", ...new Set(TEMPLATES.map((tp) => tp.category))];
  const filtered =
    templateFilter === "all"
      ? TEMPLATES
      : TEMPLATES.filter((tp) => tp.category === templateFilter);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">{t("templates", lang)}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {lang === "fr"
            ? "Modèles prêts à l'emploi pour les démarches administratives courantes"
            : "Ready-to-use templates for common administrative procedures"}
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {categories.map((c) => (
          <Button
            key={c}
            variant={templateFilter === c ? "default" : "outline"}
            size="sm"
            onClick={() => setTemplateFilter(c)}
          >
            {c === "all" ? t("all", lang) : getCategoryLabel(c, lang)}
          </Button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tp) => {
          const Icon = iconMap[tp.icon] || Home;
          return (
            <Card
              key={tp.id}
              className="p-5 flex flex-col cursor-pointer hover:bg-muted transition-colors"
              onClick={() => navigate("template-detail", { templateId: tp.id })}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className={`cat-tag ${getCategoryClass(tp.category)}`}>
                  {getCategoryLabel(tp.category, lang)}
                </span>
              </div>
              <h3 className="text-sm font-bold mb-1.5">{tp.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
                {tp.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {tp.steps.length} {t("steps", lang).toLowerCase()}
                </span>
                <span className="text-xs font-semibold text-primary">
                  {t("useTemplate", lang)} →
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
