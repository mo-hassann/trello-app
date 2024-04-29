"use client";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function Sidebar({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.includes("/boards")) return null;
  return (
    <div
      className={cn(
        "bg-muted w-[290px] h-full flex flex-col justify-between p-3 rounded-md",
        className
      )}
    >
      {children}
      <Link href={"/workspaces/create"}>
        <Button className="w-full">create work space</Button>
      </Link>
    </div>
  );
}
