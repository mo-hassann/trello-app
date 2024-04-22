import { cn } from "@/lib/utils";
import { ImSpinner2 } from "react-icons/im";

export default function Spinner({ className }: { className?: string }) {
  return (
    <div>
      <ImSpinner2 className={cn("animate-spin", className)} />
    </div>
  );
}
