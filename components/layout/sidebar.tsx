import { Button } from "../ui/button";
import WorkSpaceItems from "@/components/work-space-items";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Sidebar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-muted w-[290px] h-full flex flex-col justify-between p-3 rounded-md",
        className
      )}
    >
      <WorkSpaceItems />
      <Link href={"/workspaces/create"}>
        <Button className="w-full">create work space</Button>
      </Link>
    </div>
  );
}
