import { TriangleAlert } from "lucide-react";

export default function WarningMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 bg-yellow-300/60 text-foreground w-full px-3 py-4 rounded-md mb-5">
      <TriangleAlert />
      <p>{message}</p>
    </div>
  );
}
