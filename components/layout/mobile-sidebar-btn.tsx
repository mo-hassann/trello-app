import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { RxHamburgerMenu } from "react-icons/rx";
import Sidebar from "./sidebar";
import WorkSpaceItems from "../work-space-items";

export default function MobileSidebarBtn() {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden">
        <RxHamburgerMenu className="text-xl" />
      </SheetTrigger>
      <SheetContent side="left">
        <Sidebar className="w-full m-0 bg-transparent">
          <WorkSpaceItems />
        </Sidebar>
      </SheetContent>
    </Sheet>
  );
}
