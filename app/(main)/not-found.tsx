import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function notFoundPage() {
  return (
    <div className="size-full flex items-center justify-center gap-3 flex-col">
      <h2 className="text-6xl font-bold text-muted-foreground">Not Found</h2>
      <h2 className="text-6xl font-bold">404</h2>
      <p className="text-muted-foreground">Could not find requested resource</p>
      <Button>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
