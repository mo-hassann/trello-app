import { db } from "@/db";
import TaskLists from "./_components/task-lists";
import TaskNavbar from "./_components/task-navbar";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function BoardPage({ params: { boardId } }: { params: { boardId: string } }) {
  const { userId } = auth();
  if (!userId) return redirect("/");
  const lists = await db.list.findMany({
    where: { boardId, board: { workspace: { AdminMemberId: userId } } },
    include: { cards: true },
  });
  return (
    <>
      <TaskNavbar />
      <TaskLists lists={lists} />
    </>
  );
}
