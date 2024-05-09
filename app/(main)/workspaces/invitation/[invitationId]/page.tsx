import { db } from "@/db";
import { notFound } from "next/navigation";
import AcceptInvBtn from "../../_components/accept-inv-btn";

export default async function InvitationLinkPage({
  params: { invitationId },
}: {
  params: { invitationId: string };
}) {
  const invitationLink = await db.workspaceInvitationLink.findUnique({
    where: { id: invitationId },
    include: { workspace: { select: { name: true } } },
  });

  if (!invitationLink) return notFound();

  return (
    <div className="flex items-center justify-center size-full">
      <div className="flex items-center flex-col gap-4 border-2 border-dashed border-primary rounded-md w-[400px] py-6">
        <p>Invitation To:</p>
        <h2 className="text-4xl capitalize font-semibold mb-4">{invitationLink.workspace.name}</h2>
        <AcceptInvBtn invitationId={invitationId} />
      </div>
    </div>
  );
}
