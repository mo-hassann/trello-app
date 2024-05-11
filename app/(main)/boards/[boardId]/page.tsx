import { db } from "@/db";
import { notFound, redirect } from "next/navigation";
import Board from "./_components/board";
import { currentUser } from "@/lib/auth";

export default async function BoardPage({ params: { boardId } }: { params: { boardId: string } }) {
  const curUser = await currentUser();
  if (!curUser || !curUser.id) return redirect("/login");

  const curBoard = await db.board.findUnique({
    where: {
      id: boardId,
      OR: [{ members: { some: { id: curUser.id } } }, { workspace: { isPublic: true } }],
    },
  });
  if (!curBoard) return notFound();

  const lists = await db.list.findMany({
    where: { boardId },
    include: { cards: { orderBy: { index: "asc" } } },
    orderBy: { index: "asc" },
  });

  return (
    <>
      <div className="size-full opacity-50 absolute top-0 left-0 -z-10" />
      {/* <BoardNavbar boardName={curBoard.name}  /> */}
      <Board boardLists={lists} />
    </>
  );
}
