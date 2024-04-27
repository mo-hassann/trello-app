import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import type { ReactNode } from "react";

export default function MainRoutes({ children }: { children: ReactNode; currentUrl?: string }) {
  return (
    <div className="flex flex-col p-3 gap-3 h-full">
      <Navbar />
      <div className="flex gap-3 h-full">
        <Sidebar className="hidden md:flex h-full" />
        <div className="bg-muted/20 p-3 rounded-md w-full h-full overflow-x-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
}
