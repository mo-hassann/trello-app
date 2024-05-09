import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CircuitBoardIcon, HeartIcon, Settings } from "lucide-react";

type WorkSpaceProps = {
  icon?: string | null;
  id: string;
  name: string;
  isCurUserIsAdminUser: boolean;
};

export default function WorkSpace({ icon, id, name, isCurUserIsAdminUser }: WorkSpaceProps) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className="space-y-1">
        <AccordionTrigger className="hover:no-underline hover:bg-white/10 px-3 py-2 rounded-md">
          <Avatar>
            <AvatarImage src={icon || undefined} />
            <AvatarFallback className="bg-primary/80 text-white">{name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>{name}</div>
        </AccordionTrigger>
        <AccordionContent className="flex items-start gap-3 flex-col">
          <Link
            href={`/workspaces/${id}`}
            className="flex items-center justify-start gap-2 hover:bg-white/10 py-2 pl-10 pr-3 w-full rounded-md"
          >
            <CircuitBoardIcon /> <span>boards</span>
          </Link>
          <Link
            href={`/workspaces/${id}?filter=favorite`}
            className="flex items-center justify-start gap-2 hover:bg-white/10 py-2 pl-10 pr-3 w-full rounded-md"
          >
            <HeartIcon /> <span>favorite boards</span>
          </Link>
          {isCurUserIsAdminUser && (
            <Link
              href={`/workspaces/${id}/settings`}
              className="flex items-center justify-start gap-2 hover:bg-white/10 py-2 pl-10 pr-3 w-full rounded-md"
            >
              <Settings /> <span>settings</span>
            </Link>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
