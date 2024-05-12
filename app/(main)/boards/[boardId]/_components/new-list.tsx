"use client";

import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import NewListFrom from "./new-list-form";

export default function NewList() {
  return (
    <Dialog>
      <div className="bg-muted rounded-md flex flex-col p-3">
        <DialogTrigger className="w-[310px] flex items-center justify-center gap-2 p-3 rounded-md place-self-start flex-shrink-0 bg-primary text-white">
          <Plus />
          <p>new list</p>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New List</DialogTitle>
          <DialogDescription>
            Make changes to your list here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <NewListFrom />
      </DialogContent>
    </Dialog>
  );
}

/* 
    

*/
