import Link from "next/link";

export default function BoardLink({
  id,
  boardName,
  boardColor,
}: {
  id: string;
  boardName: string;
  boardColor: string;
}) {
  return (
    <Link href={`/boards/${id}`}>
      <div className="rounded-md p-3 w-[175px] h-[90px]" style={{ backgroundColor: boardColor }}>
        <h4>{boardName}</h4>
      </div>
    </Link>
  );
}
