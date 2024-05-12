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
import InvitationLink from "../../../../components/invitation-link";
import { useMounted } from "@/hooks/useMounted";

export default function InvitationLinkForm({
  InvitationTokenId,
  workspaceId,
  adminId,
}: {
  InvitationTokenId: string | null;
  workspaceId: string;
  adminId: string;
}) {
  const [isLoading, startTransition] = useTransition();
  const mounted = useMounted();

  const handleDelete = () => {
    startTransition(() => {
      deleteWorkspaceInvLink(InvitationTokenId!).then((data) => {
        if (data.success) toast({ description: data.success, variant: "success" });
        if (data.error) toast({ description: data.error, variant: "destructive" });
      });
    });
  };

  if (!mounted)
    return (
      <div className="size-full flex items-center justify-center">
        <Spinner />
      </div>
    );

  if (InvitationTokenId)
    return (
      <div className="flex items-center justify-between gap-3 w-full">
        <InvitationLink linkTo="workspaces" tokenId={InvitationTokenId} />
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
        {isLoading && <Spinner />} create link
      </Button>
    </form>
  );
}
