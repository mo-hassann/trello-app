import Link from "next/link";
import FavoriteBoardForm from "./favorite-board-form";

export default function BoardLink({
  id,
  boardName,
  boardFavorite,
}: {
  id: string;
  boardName: string;
  boardFavorite: boolean;
}) {
  return (
    <div className="relative bg-background hover:bg-primary hover:text-white text-primary border-2 border-dashed border-primary rounded-md p-3 w-[175px] h-[90px]">
      <Link className="size-full block" href={`/boards/${id}`}>
        <h4 className="rounded-md p-2 capitalize text-md font-semibold">{boardName}</h4>
      </Link>
      <FavoriteBoardForm boardId={id} boardFavorite={boardFavorite} />
    </div>
  );
}
