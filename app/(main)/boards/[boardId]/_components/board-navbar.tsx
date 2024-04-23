type BoardNavbarProps = { boardName: string };

export default function BoardNavbar({ boardName }: BoardNavbarProps) {
  return (
    <div className="bg-muted px-3 py-5 rounded-md mb-1 relative">
      <h2 className="font-bold text-xl capitalize">{boardName}</h2>
    </div>
  );
}
