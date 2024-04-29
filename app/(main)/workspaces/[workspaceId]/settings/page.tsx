import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/db";
import { auth } from "@clerk/nextjs";
import { unstable_cache as cache } from "next/cache";
import { notFound } from "next/navigation";
import React from "react";
import EditWorkspaceForm from "../_components/edit-workspace-form";
import { Lock, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditWorkspaceImg from "../_components/edit-workspace-img";

const getCurWorkspace = cache(
  async ({ workspaceId, userId }: { workspaceId: string; userId: string }) =>
    db.workspace.findUnique({ where: { id: workspaceId, AdminMemberId: userId } }),
  ["workspace"]
);

export default async function WorkspaceSettings({
  params: { workspaceId },
}: {
  params: { workspaceId: string };
}) {
  const { userId } = auth();
  if (!userId) throw new Error("unauthorized user");

  const curWorkspace = await getCurWorkspace({ workspaceId, userId });
  if (!curWorkspace) return notFound();

  return (
    <div className="size-full">
      <div className="bg-muted p-3 mb-8 rounded-md">
        <div className="w-full bg-background border-2 border-dashed border-primary rounded-md h-[150px]" />
        <Avatar className="size-[100px] mx-auto -mt-[50px] mb-4 relative">
          <AvatarImage src={curWorkspace.icon || undefined} />
          <AvatarFallback className="bg-primary text-white">
            {curWorkspace.name.slice(0, 2)}
          </AvatarFallback>
          <Dialog>
            <DialogTrigger className="absolute left-0 bottom-0 w-full opacity-0 hover:opacity-100 bg-white/40 transition-opacity flex items-center justify-center gap-1 rounded-lg p-2 shadow-md">
              <Pen size={12} />
              <span>Edit</span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit workspace icon</DialogTitle>
                <DialogDescription>
                  Make changes to your workspace icon here. Click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <EditWorkspaceImg />
            </DialogContent>
          </Dialog>
        </Avatar>
        <div className="flex items-center flex-col gap-2">
          <h2 className="text-4xl font-semibold capitalize">{curWorkspace.name}</h2>
          <span className="text-muted-foreground flex items-center gap-2">
            <Lock size={16} /> {curWorkspace.isPublic ? "public" : "private"}
          </span>
        </div>
      </div>
      <div className="bg-muted rounded-md size-full p-5">
        <div className="my-5 space-y-1">
          <h3 className="text-3xl font-bold capitalize">workspace settings</h3>
          <p className="text-muted-foreground">
            edit work space information here such as the workspace name and the work space access.
          </p>
        </div>
        <EditWorkspaceForm workspaceName={curWorkspace.name} isPublic={curWorkspace.isPublic} />
      </div>
    </div>
  );
}
