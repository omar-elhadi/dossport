"use client";

import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/i18n";
import { ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function SettingsPage() {
  const { lang, setLang, user } = useApp();

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-semibold mb-6">{t("settings", lang)}</h1>

      {/* Profile */}
      <Card className="p-6 mb-4">
        <h2 className="text-lg font-semibold mb-4">{t("profile", lang)}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">
              {t("name", lang)}
            </label>
            <Input defaultValue={user.name} />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">
              {t("email", lang)}
            </label>
            <Input type="email" defaultValue={user.email} />
          </div>
          <div className="flex justify-end">
            <Button onClick={() => toast.success("Profile updated")}>
              {t("save", lang)}
            </Button>
          </div>
        </div>
      </Card>

      {/* Language */}
      <Card className="p-6 mb-4">
        <h2 className="text-lg font-semibold mb-4">{t("language", lang)}</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setLang("en")}
            className={cn(
              "flex-1 p-4 rounded-lg border-2 transition-all text-center",
              lang === "en"
                ? "bg-primary/10 border-primary"
                : "bg-background border-border hover:bg-muted"
            )}
          >
            <span className="text-2xl font-bold block mb-1">EN</span>
            <span className="text-xs text-muted-foreground">English</span>
          </button>
          <button
            onClick={() => setLang("fr")}
            className={cn(
              "flex-1 p-4 rounded-lg border-2 transition-all text-center",
              lang === "fr"
                ? "bg-primary/10 border-primary"
                : "bg-background border-border hover:bg-muted"
            )}
          >
            <span className="text-2xl font-bold block mb-1">FR</span>
            <span className="text-xs text-muted-foreground">Français</span>
          </button>
        </div>
      </Card>

      {/* About */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-3">{t("about", lang)}</h2>
        <div className="flex items-center gap-2.5 mb-3">
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
          <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">
            {t("version", lang)}
          </span>
        </div>
        <div className="section-message section-message-warning">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--color-dz-warning)" }} />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("disclaimer", lang)}
          </p>
        </div>
      </Card>
    </div>
  );
}
