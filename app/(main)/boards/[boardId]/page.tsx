import { db } from "@/db";
import { notFound, redirect } from "next/navigation";
import Board from "./_components/board";
import { currentUser } from "@/lib/auth";
import BoardNavbar from "./_components/board-navbar";
import WarningMessage from "@/components/warning-message";

export default async function BoardPage({ params: { boardId } }: { params: { boardId: string } }) {
  const curUser = await currentUser();
  if (!curUser || !curUser.id) return redirect("/login");

  const curBoard = await db.board.findUnique({
    where: {
      id: boardId,
      OR: [{ members: { some: { id: curUser.id } } }, { workspace: { isPublic: true } }],
    },
    select: {
      name: true,
      members: { select: { id: true, name: true, email: true, image: true } },
      adminId: true,
      invitationLink: { select: { id: true } },
    },
  });
  if (!curBoard) return notFound();

  const lists = await db.list.findMany({
    where: { boardId },
    include: { cards: { orderBy: { index: "asc" } } },
    orderBy: { index: "asc" },
  });

  const isCurUserIsAdminUser = curBoard.adminId === curUser.id;
  const isCurUserIsMemberUser = curBoard.members.some((member) => member.id === curUser.id);

  return (
    <>
      {!isCurUserIsMemberUser && (
        <WarningMessage message="This is public board and you are not member in this board." />
      )}
      <BoardNavbar
        invitationTokenId={curBoard.invitationLink?.id || null}
        members={curBoard.members}
        isCurUserIsAdminUser={isCurUserIsAdminUser}
        boardName={curBoard.name}
      />
      <Board boardLists={lists} isCurUserIsMemberUser={isCurUserIsMemberUser} />
    </>
  );
}
