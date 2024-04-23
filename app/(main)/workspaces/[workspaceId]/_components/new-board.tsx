import { Plus } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewBoardFrom from "./new-board-form";

export default function NewBoard() {
  return (
    <Dialog>
      <DialogTrigger className="bg-muted flex items-center justify-center rounded-md p-3 w-[175px] h-[90px] hover:opacity-80 transition-opacity">
        <Plus />
        &nbsp;<h4>New Board</h4>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Board</DialogTitle>
          <DialogDescription>
            Make changes to your list here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <NewBoardFrom />
      </DialogContent>
    </Dialog>
  );
}
