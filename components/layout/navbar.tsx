import { UserButton } from "@/components/auth/user-button";
import ThemeBtn from "../theme-btn";
import Logo from "../logo";
import MobileSidebarBtn from "./mobile-sidebar-btn";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Navbar({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center justify-between px-5 py-3 bg-muted rounded-md", className)}
    >
      <div className="flex items-center gap-3">
        <MobileSidebarBtn />
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <ThemeBtn />
        <UserButton />
      </div>
    </div>
  );
}
