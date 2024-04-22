"use client";

import { DragDropContext } from "@hello-pangea/dnd";
import List from "./list";
import NewList from "./new-list";
import { card, list } from "@prisma/client";

export default function TaskLists({ lists }: { lists: (list & { cards: card[] })[] }) {
  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="flex items-start gap-5 overflow-x-auto w-full py-3">
        {lists.map((list) => (
          <List key={list.id} id={list.id} listName={list.name} cards={list.cards} />
        ))}
        <NewList />
      </div>
    </DragDropContext>
  );
}
