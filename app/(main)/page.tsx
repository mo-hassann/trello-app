import React from "react";
import BoardLink from "./workspaces/_components/board-link";
import { Star, User2Icon, UserCog2 } from "lucide-react";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";

export default async function homePage() {
  const curUser = await currentUser();
  if (!curUser || !curUser.id) return redirect("/login");

  const starredBoards = await db.board.findMany({
    where: { favoriteBoard: { userId: curUser.id } },
    select: { id: true, name: true, favoriteBoard: true },
  });

  const userBoards = await db.board.findMany({
    where: { members: { some: { id: curUser.id } } },
    select: { id: true, name: true, favoriteBoard: true },
  });

  const adminBoards = await db.board.findMany({
    where: { adminId: curUser.id },
    select: { id: true, name: true, favoriteBoard: true },
  });

  return (
    <>
      {adminBoards.length > 0 && (
        <section className="mb-4">
          <div className="flex items-center gap-2 py-4 px-1">
            <UserCog2 />
            <h3 className="text-3xl font-bold capitalize">admin boards</h3>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(175px,1fr))] items-center justify-items-center md:justify-items-start gap-3">
            {adminBoards.map((board) => (
              <BoardLink
                key={board.id}
                id={board.id}
                boardName={board.name}
                boardFavorite={!!board.favoriteBoard}
              />
            ))}
          </div>
        </section>
      )}
      {starredBoards.length > 0 && (
        <section className="mb-4">
          <div className="flex items-center gap-2 py-4 px-1">
            <Star />
            <h3 className="text-3xl font-bold capitalize">starred boards</h3>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(175px,1fr))] items-center justify-items-center md:justify-items-start gap-3">
            {starredBoards.map((board) => (
              <BoardLink
                key={board.id}
                id={board.id}
                boardName={board.name}
                boardFavorite={!!board.favoriteBoard}
              />
            ))}
          </div>
        </section>
      )}
      {userBoards.length > 0 && (
        <section className="mb-4">
          <div className="flex items-center gap-2 py-4 px-1">
            <User2Icon />
            <h3 className="text-3xl font-bold capitalize">Your boards</h3>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(175px,1fr))] items-center justify-items-center md:justify-items-start gap-3">
            {userBoards.map((board) => (
              <BoardLink
                key={board.id}
                id={board.id}
                boardName={board.name}
                boardFavorite={!!board.favoriteBoard}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
