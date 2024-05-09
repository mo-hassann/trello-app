"use server";

import { db } from "@/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const createWorkspaceInvLink = async (workspaceId?: string, adminId?: string) => {
  try {
    const curUser = await currentUser();
    if (!curUser || !curUser.id) return { error: "unauthorized" };
    if (!workspaceId || !adminId) return { error: "missing data" };

    if (adminId !== curUser.id)
      return { error: "you do not have the permission to do this action" };

    const workspace = await db.workspace.findUnique({ where: { id: workspaceId, adminId } });
    if (!workspace) return { error: "workspace does not exist" };

    const workspaceInvLink = await db.workspaceInvitationLink.create({
      data: { workspaceId: workspace.id },
    });

    revalidatePath("/");
    revalidatePath(`/workspaces/${workspace.id}`);

    return {
      success: `${curUser.name} created "${workspace.name}" invitation link successfully`,
      data: workspaceInvLink,
    };
  } catch (error: any) {
    return { error: error.message || "server error" };
  }
};

export const deleteWorkspaceInvLink = async (invitationId: string) => {
  try {
    if (!invitationId) return { error: "missing data" };

    const curUser = await currentUser();
    if (!curUser || !curUser.id) return { error: "unauthorized" };

    const invitationLink = await db.workspaceInvitationLink.findUnique({
      where: { id: invitationId },
      select: { workspace: { select: { id: true, adminId: true } } },
    });
    if (!invitationLink) return { error: "invitation link does not exist" };
    if (invitationLink.workspace.adminId !== curUser.id)
      return { error: "you do not have the permission to do this action" };

    const workspaceInvLink = await db.workspaceInvitationLink.delete({
      where: { id: invitationId },
    });

    revalidatePath("/");
    revalidatePath(`/workspaces/${invitationLink.workspace.id}`);

    return {
      success: `invitation link deleted successfully`,
      data: workspaceInvLink,
    };
  } catch (error: any) {
    return { error: error.message || "server error" };
  }
};
