import { db } from "@/db";

import BoardLink from "../_components/board-link";
import NewBoard from "../_components/new-board";
import { notFound, redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import WorkspaceNavbar from "../_components/workspace-navbar";
import WarningMessage from "@/components/warning-message";

export default async function workspacePage({
  params: { workspaceId },
  searchParams: { filter },
}: {
  params: { workspaceId: string };
  searchParams: { filter: "favorite" };
}) {
  const curUser = await currentUser();
  if (!curUser || !curUser.id) return redirect("/login");

  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId, OR: [{ isPublic: true }, { members: { some: { id: curUser.id } } }] },
    select: {
      name: true,
      members: { select: { id: true, name: true, email: true, image: true } },
      adminId: true,
      invitationLink: { select: { id: true } },
    },
  });
  if (!workspace) return notFound();

  const isCurUserIsAdminUser = workspace.adminId === curUser.id;
  const isCurUserIsMemberUser = workspace.members.some((member) => member.id === curUser.id);

  const boards = await db.board.findMany({
    where: { workspaceId },
    select: {
      id: true,
      name: true,
      favoriteBoard: { where: { userId: curUser.id } },
    },
  });

  let filteredBoards = null;

  if (filter === "favorite") {
    filteredBoards = boards.filter((board) => !!board.favoriteBoard);
  }

  return (
    <>
      {!isCurUserIsMemberUser && (
        <WarningMessage message="This is public workspace and you are not member in this workspace." />
      )}
      <WorkspaceNavbar
        isCurUserIsAdminUser={isCurUserIsAdminUser}
        workspaceName={workspace?.name}
        members={workspace.members}
        invitationTokenId={workspace.invitationLink?.id || null}
      />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(175px,1fr))] items-center justify-items-center md:justify-items-start gap-3">
        {isCurUserIsAdminUser && !filteredBoards && <NewBoard />}
        {(filteredBoards || boards).length === 0 && (
          <p className="text-muted-foreground italic col-span-full place-self-center py-3">
            No boards here 😢
          </p>
        )}
        {(filteredBoards || boards).map((board) => (
          <BoardLink
            key={board.id}
            id={board.id}
            boardName={board.name}
            boardFavorite={!!board.favoriteBoard}
          />
        ))}
      </div>
    </>
  );
}
