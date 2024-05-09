"use client";

import { Button } from "@/components/ui/button";
import { FaRegStar, FaStar } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";

export default function BoardLink({ id, boardName }: { id: string; boardName: string }) {
  const [isFavorite, setIsFavorite] = useState(false);
  return (
    <div className="relative bg-background hover:bg-primary hover:text-white text-primary border-2 border-dashed border-primary rounded-md p-3 w-[175px] h-[90px]">
      <Link className="size-full block" href={`/boards/${id}`}>
        <h4 className="rounded-md p-2 capitalize text-md font-semibold">{boardName}</h4>
      </Link>
      <Button
        className="absolute bottom-3 right-3 z-10 p-0 size-5 hover:bg-transparent hover:opacity-80"
        variant="ghost"
        size="sm"
        onClick={() => setIsFavorite((curIsFavorite) => !curIsFavorite)}
      >
        {isFavorite ? <FaStar size={20} /> : <FaRegStar size={20} />}
      </Button>
    </div>
  );
}
