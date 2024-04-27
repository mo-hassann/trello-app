import { db } from "@/db";

import BoardLink from "./_components/board-link";
import NewBoard from "./_components/new-board";
import { unstable_cache as cache } from "next/cache";

const getBoards = cache(
  async (workspaceId: string) => db.board.findMany({ where: { workspaceId } }),
  ["boards"]
);

export default async function workspacePage({
  params: { workspaceId },
}: {
  params: { workspaceId: string };
}) {
  const boards = await getBoards(workspaceId);
  return (
    <div>
      <h2 className="mb-3">workspace boards</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(175px,1fr))] justify-items-center md:justify-items-start gap-3">
        {boards.map((board) => (
          <BoardLink
            key={board.id}
            id={board.id}
            boardName={board.name}
            boardColor={board.backgroundColor}
          />
        ))}

        <NewBoard />
      </div>
    </div>
  );
}
