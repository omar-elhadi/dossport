"use client";

import { useState } from "react";
import { Eye, EyeOff, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AuthScreenProps {
  onAuth: () => void;
}

export function AuthScreen({ onAuth }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth();
    toast.success(
      mode === "login" ? "Welcome back, Alex" : "Account created successfully"
    );
  };

  return (
    <div className="auth-surface h-full flex items-center justify-center p-4">
      <div
        className="relative z-10 bg-background border border-border rounded-2xl w-full max-w-[420px] p-8 animate-scale-in"
        style={{ boxShadow: "0px 8px 12px rgba(30,31,33,0.15), 0px 0px 1px rgba(30,31,33,0.31)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
              <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
              <path d="m9 15 2 2 4-4"/>
            </svg>
          </div>
          <span className="text-xl font-bold">
            <span className="text-foreground">Dossier</span>
            <span className="text-primary">Zen</span>
          </span>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-6">
          <div className="flex gap-1">
            <button
              onClick={() => setMode("login")}
              className={cn(
                "flex-1 py-2 text-sm font-semibold transition-all border-b-2 -mb-px",
                mode === "login"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              )}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode("register")}
              className={cn(
                "flex-1 py-2 text-sm font-semibold transition-all border-b-2 -mb-px",
                mode === "register"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              )}
            >
              Create account
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5">Full name</label>
              <Input placeholder="Alex Martin" />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5">Email address</label>
            <Input type="email" placeholder="alex@example.com" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                className="pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === "login" && (
            <div className="mb-5 text-right">
              <button
                type="button"
                className="text-sm text-primary hover:underline font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button type="submit" className="w-full py-2.5 text-[15px]">
            {mode === "login" ? "Sign in" : "Create account"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground font-medium">or continue with</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* FranceConnect */}
        <Button variant="outline" className="w-full py-2.5">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#1B1464" />
            <path
              d="M7.5 16.5c-1.2 0-2.25-.45-3-1.2L6 13.8c.45.45.9.7 1.5.7.45 0 .75-.15.75-.45 0-.3-.15-.45-1.05-.6-1.5-.3-2.55-.9-2.55-2.4 0-1.35 1.05-2.25 2.55-2.25 1.05 0 1.95.3 2.7 1.05l-1.2 1.5c-.45-.3-.9-.6-1.5-.6-.4 0-.6.15-.6.4 0 .25.2.4 1.05.6 1.5.3 2.55.75 2.55 2.35 0 1.5-1.2 2.5-2.7 2.5zm5.25-6h1.5v6h-1.5v-6zm.75-2.25c.6 0 1.05.45 1.05 1.05s-.45 1.05-1.05 1.05-1.05-.45-1.05-1.05.45-1.05 1.05-1.05zm4.5 2.25h1.5v.6c.45-.45 1.05-.75 1.65-.75v1.5c-.9 0-1.65.45-1.65 1.2v3.45h-1.5v-6z"
              fill="white"
            />
          </svg>
          FranceConnect
        </Button>

        {/* Warning */}
        <div className="section-message section-message-warning mt-5">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--color-dz-warning)" }} />
          <p className="text-xs leading-relaxed">
            DossierZen does not submit paperwork to any administration. It is a personal organizer only.
          </p>
        </div>
      </div>
    </div>
  );
}
