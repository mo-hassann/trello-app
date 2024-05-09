import { db } from "@/db";

import BoardLink from "../_components/board-link";
import NewBoard from "../_components/new-board";
import { notFound, redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import WorkspaceNavbar from "../_components/workspace-navbar";

export default async function workspacePage({
  params: { workspaceId },
}: {
  params: { workspaceId: string };
}) {
  const curUser = await currentUser();
  if (!curUser || !curUser.id) return redirect("/login");

  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId, OR: [{ isPublic: true }, { members: { some: { id: curUser.id } } }] },
    select: {
      name: true,
      members: { select: { id: true, name: true, email: true, image: true } },
      adminId: true,
    },
  });
  if (!workspace) return notFound();
  const boards = await db.board.findMany({ where: { workspaceId } });
  const isCurUserIsAdminUser = workspace.adminId === curUser.id;
  return (
    <div>
      <WorkspaceNavbar
        isCurUserIsAdminUser={isCurUserIsAdminUser}
        workspaceName={workspace?.name}
        members={workspace.members}
      />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(175px,1fr))] justify-items-center md:justify-items-start gap-3">
        {boards.map((board) => (
          <BoardLink key={board.id} id={board.id} boardName={board.name} />
        ))}
        {isCurUserIsAdminUser && <NewBoard />}
      </div>
    </div>
  );
}
