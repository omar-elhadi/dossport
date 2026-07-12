"use client";

import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/i18n";
import { getCategoryLabel, getCategoryClass } from "@/lib/helpers";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Category } from "@/types";

interface CreateTaskModalProps {
  onClose: () => void;
}

const categories: Category[] = [
  "caf",
  "cpam",
  "tax",
  "ants",
  "prefecture",
  "crous",
  "travail",
  "other",
];

export function CreateTaskModal({ onClose }: CreateTaskModalProps) {
  const { lang, tasks, setTasks, navigate } = useApp();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("caf");
  const [deadline, setDeadline] = useState("");
  const [stepsText, setStepsText] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.warning("Please enter a task title");
      return;
    }

    const steps = stepsText
      .split("\n")
      .filter((l) => l.trim())
      .map((l, i) => ({
        id: "ns" + Date.now() + i,
        title: l.trim(),
        desc: "",
        done: false,
      }));

    const finalDeadline =
      deadline || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];

    const newId = String(Date.now());
    const keyNum = tasks.length + 1;
    const newTask = {
      id: newId,
      key: `DZ-${keyNum}`,
      title: title.trim(),
      titleFr: title.trim(),
      description: description.trim(),
      category,
      status: "todo" as const,
      deadline: finalDeadline,
      createdAt: new Date().toISOString().split("T")[0],
      steps,
      docs: [],
    };

    setTasks((prev) => [newTask, ...prev]);
    onClose();
    navigate("task-detail", { taskId: newId });
    toast.success(`Task "${title.trim()}" created`);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "rgba(5, 12, 31, 0.46)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-background rounded-xl w-full max-w-lg overflow-hidden animate-scale-in" style={{ boxShadow: "0px 8px 12px rgba(30,31,33,0.15), 0px 0px 1px rgba(30,31,33,0.31)" }}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-base font-bold">{t("createTask", lang)}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">{t("title", lang)}</label>
            <Input
              placeholder="e.g. CAF housing aid renewal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">{t("description", lang)}</label>
            <Textarea
              rows={3}
              placeholder="Describe the procedure..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">{t("category", lang)}</label>
              <Select value={category} onValueChange={(val) => setCategory(val as Category)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {getCategoryLabel(c, lang)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t("deadline", lang)}</label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground mb-2 font-medium">
              {t("steps", lang)} (optional — add one per line)
            </p>
            <Textarea
              rows={4}
              placeholder={"Gather documents\nSubmit online\nConfirm receipt"}
              value={stepsText}
              onChange={(e) => setStepsText(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-5 border-t border-border bg-muted/50">
          <Button variant="outline" onClick={onClose}>
            {t("cancel", lang)}
          </Button>
          <Button onClick={handleSubmit}>{t("createTask", lang)}</Button>
        </div>
      </div>
    </div>
  );
}
