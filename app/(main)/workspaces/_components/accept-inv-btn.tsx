"use client";

import { addWorkspaceMemberViaLink } from "@/actions/workspace/add-workspace-member-via-link";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function AcceptInvBtn({ invitationId }: { invitationId: string }) {
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = () => {
    startTransition(() => {
      addWorkspaceMemberViaLink(invitationId).then((data) => {
        if (data.success) {
          toast({ description: data.success, variant: "success" });

          router.push(`/workspaces/${data.data.id}`);
        }
        if (data.error) toast({ description: data.error, variant: "destructive" });
      });
    });
  };

  return (
    <form action={handleSubmit}>
      <Button className="flex items-center gap-2" disabled={isLoading} type="submit">
        {isLoading ? <Spinner /> : <UsersIcon />} <span>Join</span>
      </Button>
    </form>
  );
}
