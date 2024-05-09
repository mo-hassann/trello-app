import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function UserIcon({
  fullback,
  image,
}: {
  fullback: string | null;
  image: string | null;
}) {
  return (
    <Avatar className="shadow-[-1px_2px_5px_0px_#4c4c4ccc]">
      <AvatarImage src={image || undefined} />
      <AvatarFallback className="bg-primary text-white">{fullback?.slice(0, 2)}</AvatarFallback>
    </Avatar>
  );
}
