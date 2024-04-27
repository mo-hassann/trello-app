import WorkSpace from "@/components/work-space";
import { db } from "@/db";
import { auth } from "@clerk/nextjs";

import { unstable_cache as cache } from "next/cache";

const getWorkspaces = cache(
  async (userId: string) => db.workspace.findMany({ where: { AdminMemberId: userId } }),
  ["workspaces"]
);

export default async function WorkSpaceItems() {
  const { userId } = auth();
  if (!userId) throw new Error("unauthorized user");

  const workspaces = await getWorkspaces(userId);
  return (
    <div>
      <h3 className="my-2 text-sm text-muted-foreground">work spaces</h3>
      {workspaces.map((workspace) => (
        <WorkSpace
          key={workspace.id}
          name={workspace.name}
          id={workspace.id}
          icon={workspace.icon}
        />
      ))}
    </div>
  );
}
