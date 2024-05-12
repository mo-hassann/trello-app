"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Pencil, Link, Plus } from "lucide-react";
import UserIcon from "@/components/user-icon";
import EditBoardNameForm from "./edit-board-name-form";
import InvitationLink from "@/components/invitation-link";
type boardNavbarProps = {
  boardName: string;
  members: { name: string | null; image: string | null; email: string | null; id: string }[];
  isCurUserIsAdminUser: boolean;
  invitationTokenId: string | null;
};

export default function BoardNavbar({
  boardName,
  members,
  isCurUserIsAdminUser,
  invitationTokenId,
}: boardNavbarProps) {
  const [isEditingBoardName, setIsEditingBoardName] = useState(false);

  const toggleIsEditing = () => {
    setIsEditingBoardName((curState) => !curState);
  };

  return (
    <div className="flex items-center justify-between mb-7 w-full">
      <div className="flex items-center gap-5">
        {isEditingBoardName ? (
          <EditBoardNameForm boardName={boardName} setIsEditing={setIsEditingBoardName} />
        ) : (
          <h2 className="text-5xl font-bold capitalize" onClick={toggleIsEditing}>
            {boardName}
          </h2>
        )}
        <div className="flex items-center gap-3">
          {isCurUserIsAdminUser && (
            <Button
              size="sm"
              variant="ghost"
              className="p-1 size-6 text-primary bg-primary/20 hover:bg-primary hover:text-white"
              onClick={toggleIsEditing}
            >
              <Pencil />
            </Button>
          )}
          {invitationTokenId && (
            <Popover>
              <PopoverTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 p-1 size-6 text-primary bg-primary/20 hover:bg-primary hover:text-white hover:text-accent-foreground">
                <Link />
              </PopoverTrigger>
              <PopoverContent className="w-[450px]">
                <InvitationLink linkTo="boards" tokenId={invitationTokenId} />
              </PopoverContent>
            </Popover>
          )}
        </div>
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
