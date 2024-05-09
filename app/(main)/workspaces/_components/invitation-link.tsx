"use client";

import {
  createWorkspaceInvLink,
  deleteWorkspaceInvLink,
} from "@/actions/workspace/workspace-invitation-link";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Trash } from "lucide-react";
import { useTransition } from "react";

export default function InvitationLink({
  invitationLink,
  workspaceId,
  adminId,
}: {
  invitationLink: string | null;
  workspaceId: string;
  adminId: string;
}) {
  const [isLoading, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(() => {
      deleteWorkspaceInvLink(invitationLink!).then((data) => {
        if (data.success) toast({ description: data.success, variant: "success" });
        if (data.error) toast({ description: data.error, variant: "destructive" });
      });
    });
  };

  if (invitationLink)
    return (
      <div className="flex items-center gap-3">
        <p>{`${location.origin}/workspaces/invitation/${invitationLink}`}</p>
        <form action={handleDelete}>
          <Button variant="destructive" disabled={isLoading} type="submit">
            {isLoading ? <Spinner /> : <Trash size={15} />}
          </Button>
        </form>
      </div>
    );

  const handleSubmit = () => {
    startTransition(() => {
      createWorkspaceInvLink(workspaceId, adminId).then((data) => {
        if (data.success) toast({ description: data.success, variant: "success" });
        if (data.error) toast({ description: data.error, variant: "destructive" });
      });
    });
  };

  return (
    <form action={handleSubmit}>
      <Button disabled={isLoading} type="submit">
        {" "}
        {isLoading && <Spinner />} create link
      </Button>
    </form>
  );
}
