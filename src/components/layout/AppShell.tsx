"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { SearchModal } from "@/components/modals/SearchModal";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-[240px]">
        <Header onOpenSearch={() => setSearchOpen(true)} />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
