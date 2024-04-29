"use client";

import { CircleX } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function ErrorComponent({ error }: { error: Error }) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2 items-center bg-muted rounded-lg w-[90vw] sm:w-[500px] p-6">
      <div className="flex items-center justify-center gap-2">
        <CircleX size={50} />
        <h1 className="text-6xl font-bold">Error</h1>
      </div>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <Button onClick={() => router.refresh()}>Retry</Button>
    </div>
  );
}
