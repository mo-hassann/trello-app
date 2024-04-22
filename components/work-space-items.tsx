import WorkSpace from "@/components/work-space";
import { db } from "@/db";

export default async function WorkSpaceItems() {
  const workspaces = await db.workspace.findMany();
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
