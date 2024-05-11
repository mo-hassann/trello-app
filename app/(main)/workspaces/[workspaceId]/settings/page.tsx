import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/db";
import { notFound, redirect } from "next/navigation";
import React from "react";
import EditWorkspaceForm from "../../_components/edit-workspace-form";
import { Lock, Pen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditWorkspaceImg from "../../_components/edit-workspace-img";
import { currentUser } from "@/lib/auth";
import InvitationLinkForm from "../../_components/invitation-link-form";

export default async function WorkspaceSettings({
  params: { workspaceId },
}: {
  params: { workspaceId: string };
}) {
  const curUser = await currentUser();
  if (!curUser || !curUser.id) return redirect("/login");

  const curWorkspace = await db.workspace.findUnique({
    where: { id: workspaceId, adminId: curUser.id },
    select: { name: true, isPublic: true, icon: true, invitationLink: { select: { id: true } } },
  });
  if (!curWorkspace) return notFound();

  return (
    <>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-3">
        <div className="flex flex-col bg-muted rounded-md size-full min-h-[250px] p-5">
          <div className="my-5 space-y-1">
            <h3 className="text-3xl font-bold capitalize">workspace settings</h3>
            <p className="text-muted-foreground">
              edit work space information here such as the workspace name and the work space access.
            </p>
          </div>
          <EditWorkspaceForm workspaceName={curWorkspace.name} isPublic={curWorkspace.isPublic} />
        </div>
        <div className="flex flex-col bg-muted rounded-md size-full min-h-[250px] p-5">
          <h3 className="text-3xl font-bold capitalize my-5">invitation link</h3>
          <InvitationLinkForm
            InvitationTokenId={curWorkspace.invitationLink?.id || null}
            workspaceId={workspaceId}
            adminId={curUser.id}
          />
        </div>
      </div>
    </>
  );
}
