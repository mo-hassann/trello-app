"use client";

import { Button } from "@/components/ui/button";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useState, useTransition } from "react";
import { setFavoriteBoard } from "@/actions/board/favorite-board";
import { toast } from "@/components/ui/use-toast";

export default function FavoriteBoardForm({
  boardId,
  boardFavorite,
}: {
  boardId: string;
  boardFavorite: boolean;
}) {
  const [isLoading, startTransition] = useTransition();
  const [isFavorite, setIsFavorite] = useState(boardFavorite);

  const handleSubmit = () => {
    startTransition(async () => {
      await setFavoriteBoard({ favoriteState: isFavorite }, boardId).then((data) => {
        if (data.success) toast({ description: data.success, variant: "success" });
        if (data.error) toast({ description: data.error, variant: "destructive" });
      });
    });
  };

  return (
    <form action={handleSubmit}>
      <Button
        className="absolute bottom-3 right-3 z-10 p-0 size-5 hover:bg-transparent hover:opacity-80"
        variant="ghost"
        size="sm"
        disabled={isLoading}
        onClick={() => setIsFavorite((curIsFavorite) => !curIsFavorite)}
      >
        {isFavorite ? <FaStar size={20} /> : <FaRegStar size={20} />}
      </Button>
    </form>
  );
}
