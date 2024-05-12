"use server";

import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";

export const addWorkspaceMemberViaLink = async (invitationId: string) => {
  try {
    if (!invitationId) return { error: "missing data" };
    const curUser = await currentUser();
    if (!curUser || !curUser.id) return { error: "unauthorized" };

    const user = db.user.findUnique({ where: { id: curUser.id } });
    if (!user) return { error: "user does not exist on the database" };

    const invitationLink = await db.workspaceInvitationLink.findUnique({
      where: { id: invitationId },
    });
    if (!invitationLink) return { error: "link not valid" };

    const workspace = await db.workspace.findUnique({
      where: { id: invitationLink.workspaceId },
      include: { members: { select: { id: true } } },
    });

    if (!workspace) return { error: "workspace does not exist" };
    if (workspace.members.some((member) => member.id === curUser.id))
      return { success: "you are already in the workspace", data: workspace };

    // connect user with the workspace
    const workspaceWithNewUser = await db.workspace.update({
      where: { id: invitationLink.workspaceId },
      data: { members: { connect: { id: curUser.id } } },
      select: { id: true, boards: { select: { id: true } } },
    });

    // connect user with all the boards in the workspace
    await db.user.update({
      where: { id: curUser.id },
      data: { boards: { connect: workspaceWithNewUser.boards } },
    });

    revalidatePath("/");
    revalidatePath(`/workspaces/${workspace.id}`);

    return {
      success: `you joined "${workspace.name}" workspace successfully`,
      data: workspaceWithNewUser,
    };
  } catch (error: any) {
    return { error: error.message || "server error" };
  }
};
