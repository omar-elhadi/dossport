export type TaskStatus = "todo" | "in_progress" | "completed";
export type Urgency = "normal" | "urgent" | "critical" | "late";

export type Category =
  | "caf"
  | "cpam"
  | "tax"
  | "ants"
  | "prefecture"
  | "crous"
  | "travail"
  | "other";

export type DocType =
  | "paySlip"
  | "idDoc"
  | "proofAddress"
  | "bankDetails"
  | "civilStatus"
  | "taxDoc";

export type NotificationType = "danger" | "warning" | "information" | "success";

export interface Step {
  id: string;
  title: string;
  desc: string;
  done: boolean;
}

export interface Task {
  id: string;
  key: string;
  title: string;
  titleFr: string;
  description: string;
  category: Category;
  status: TaskStatus;
  deadline: string;
  createdAt: string;
  steps: Step[];
  docs: string[];
}

export interface Document {
  id: string;
  name: string;
  type: DocType;
  size: string;
  uploadedAt: string;
  tasks: string[];
}

export interface Template {
  id: string;
  title: string;
  titleFr: string;
  category: Category;
  description: string;
  icon: string;
  steps: { title: string; desc: string }[];
  requiredDocs: string[];
  officialLink: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  icon: string;
  message: string;
  time: string;
  read: boolean;
}

export type Page =
  | "dashboard"
  | "tasks"
  | "task-detail"
  | "templates"
  | "template-detail"
  | "documents"
  | "settings";

export interface TaskFilter {
  status: string;
  category: string;
  sort: string;
  search: string;
}

export type Lang = "en" | "fr";
