import { db } from "@/db";
import BoardNavbar from "./_components/board-navbar";
import { auth } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import Board from "./_components/board";
import { unstable_cache as cache } from "next/cache";

const getCurBoard = cache(
  async ({ boardId, userId }: { boardId: string; userId: string }) =>
    db.board.findUnique({
      where: { id: boardId, workspace: { AdminMemberId: userId } },
    }),
  ["boards"]
);

const getBoardLists = cache(
  async ({ boardId, userId }: { boardId: string; userId: string }) =>
    await db.list.findMany({
      where: { boardId, board: { workspace: { AdminMemberId: userId } } },
      include: { cards: { orderBy: { index: "asc" } } },
      orderBy: { index: "asc" },
    }),
  ["lists"]
);

export default async function BoardPage({ params: { boardId } }: { params: { boardId: string } }) {
  const { userId } = auth();
  if (!userId) throw new Error("unauthorized user");

  const curBoard = await getCurBoard({ boardId, userId });
  if (!curBoard) return notFound();

  const lists = await getBoardLists({ boardId, userId });

  return (
    <>
      <div
        style={{ backgroundColor: curBoard.backgroundColor }}
        className="size-full opacity-50 absolute top-0 left-0 -z-10"
      />
      <BoardNavbar boardName={curBoard.name} />
      <Board boardLists={lists} />
    </>
  );
}
