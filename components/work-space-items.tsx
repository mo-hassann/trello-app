import WorkSpace from "@/components/work-space";
import { db } from "@/db";

import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";

export default async function WorkSpaceItems() {
  const curUser = await currentUser();
  if (!curUser || !curUser.id) return redirect("/login");

  const workspaces = await db.workspace.findMany({
    where: { members: { some: { id: curUser.id } } },
  });
  return (
    <div>
      <h3 className="my-2 text-sm text-muted-foreground">work spaces</h3>
      {workspaces.map((workspace) => (
        <WorkSpace
          key={workspace.id}
          name={workspace.name}
          id={workspace.id}
          icon={workspace.icon}
          isCurUserIsAdminUser={workspace.adminId === curUser.id}
        />
      ))}
    </div>
  );
}
