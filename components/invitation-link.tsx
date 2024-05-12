"use client";

import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

export default function InvitationLink({
  tokenId,
  linkTo,
}: {
  tokenId: string;
  linkTo: "workspaces" | "boards";
}) {
  const [link, setLink] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState(false);

  useEffect(() => {
    const origin = window.location.origin;
    setLink(`${origin}/${linkTo}/invitation/${tokenId}`);
  }, [tokenId, linkTo]);

  const copyToClipBoard = () => {
    if (link) navigator.clipboard.writeText(link);
    setCopyStatus(true);
    setTimeout(() => {
      setCopyStatus(false);
    }, 2000);
  };

  return link ? (
    <div className="flex items-center gap-2 w-full">
      <p className="h-auto max-w-[300px] truncate">{link}</p>
      <Button disabled={copyStatus} onClick={copyToClipBoard} variant="ghost">
        {copyStatus ? <Check /> : <Copy />}
      </Button>
    </div>
  ) : (
    <Spinner />
  );
}
