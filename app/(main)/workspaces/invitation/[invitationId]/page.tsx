import { db } from "@/db";
import { notFound } from "next/navigation";
import AcceptInvBtn from "../../_components/accept-inv-btn";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";

export default async function InvitationLinkPage({
  params: { invitationId },
}: {
  params: { invitationId: string };
}) {
  const invitationLink = await db.workspaceInvitationLink.findUnique({
    where: { id: invitationId },
    include: { workspace: { select: { name: true, isPublic: true } } },
  });

  if (!invitationLink) return notFound();

  return (
    <div className="flex items-center justify-center size-full">
      <div className="flex items-center flex-col gap-4 border-2 border-dashed border-primary rounded-md w-[400px] py-6">
        <p className="text-muted-foreground">Invitation To:</p>
        <h2 className="text-4xl capitalize font-semibold mb-4">{invitationLink.workspace.name}</h2>
        <div className="flex items-center gap-3">
          <AcceptInvBtn invitationId={invitationId} />
          {invitationLink.workspace.isPublic && (
            <Button variant={"ghost"}>
              <Link
                className="flex items-center gap-2"
                href={`/workspaces/${invitationLink.workspaceId}`}
                target="_blank"
              >
                <EyeIcon />
                <span>View</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
