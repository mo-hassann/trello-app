import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Link, Plus } from "lucide-react";
import UserIcon from "@/components/user-icon";
type WorkspaceNavbarProps = {
  workspaceName: string;
  members: { name: string | null; image: string | null; email: string | null; id: string }[];
  isCurUserIsAdminUser: boolean;
};

export default function WorkspaceNavbar({
  workspaceName: boardName,
  members,
  isCurUserIsAdminUser,
}: WorkspaceNavbarProps) {
  return (
    <div className="flex items-center justify-between mb-7 w-full">
      <div className="flex items-center gap-5">
        <h2 className="text-5xl font-bold capitalize">{boardName}</h2>
        {isCurUserIsAdminUser && (
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              className="p-1 size-6 text-primary bg-primary/20 hover:bg-primary hover:text-white"
            >
              <Pencil />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="p-1 size-6 text-primary bg-primary/20 hover:bg-primary hover:text-white"
            >
              <Link />
            </Button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <ul className="flex items-center -space-x-4">
          {members.map((member) => (
            <li key={member.id}>
              <UserIcon fullback={member.name} image={member.image} />
            </li>
          ))}
        </ul>
        {isCurUserIsAdminUser && (
          <Button variant="ghost" className="space-x-1 text-primary">
            <Plus className="bg-primary/20 rounded-sm p-[2px]" size={14} />
            <span>invite</span>
          </Button>
        )}
      </div>
    </div>
  );
}
