import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Link, PlusCircle, Plus } from "lucide-react";
type BoardNavbarProps = { boardName: string };

export default function BoardNavbar({ boardName }: BoardNavbarProps) {
  return (
    <div className="flex items-center justify-between mb-7 w-full">
      <div className="flex items-center gap-5">
        <h2 className="text-5xl font-bold capitalize">{boardName}</h2>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="ghost"
            className="p-1 size-6 text-primary bg-primary/20 hover:bg-primary hover:text-white"
          >
            <Pencil />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="p-1 size-6 text-primary bg-primary/20 hover:bg-primary hover:text-white"
          >
            <Link />
          </Button>
        </div>
      </div>
      <Button variant="ghost" className="space-x-1 text-primary">
        <Plus className="bg-primary/20 rounded-sm p-[2px]" size={14} />
        <span>invite</span>
      </Button>
    </div>
  );
}
