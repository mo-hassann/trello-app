"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { MoreHorizontalIcon, Pen } from "lucide-react";
import CardContent from "./card-content";
import NewCardForm from "./new-card-form";
import { card } from "@prisma/client";

type ListProps = {
  id: string;
  listName: string;
  cards: card[];
};

export default function List({ id, listName, cards }: ListProps) {
  return (
    <div className="rounded-md p-3 bg-muted text-muted-foreground w-[310px] flex-shrink-0">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{listName}</h2>
        <Button className="p-0 hover:bg-slate-200/20 size-8 text-sm" variant="ghost">
          <MoreHorizontalIcon />
        </Button>
      </div>
      <Droppable droppableId={`${id}`} type="LIST">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            className={cn(snapshot.isDraggingOver && "bg-muted-foreground/20 rounded-md")}
            {...provided.droppableProps}
          >
            <div className="flex flex-col gap-3 my-4">
              {cards.length === 0 && (
                <p className="italic text-center text-muted-foreground">no cards here 😥</p>
              )}
              {cards.length > 0 &&
                cards.map((card, i) => (
                  <Draggable key={card.id} draggableId={`${card.id}`} index={i}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-background rounded-lg p-4 border-2 hover:border-primary flex justify-between"
                      >
                        <CardContent title={card.title} />
                        <Button
                          variant="ghost"
                          className="p-2 bg-slate-200/20 hover:bg-primary hover:text-white size-8 text-xs rounded-full"
                        >
                          <Pen />
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
            </div>
            {provided.placeholder}
            <NewCardForm listId={id} />
          </div>
        )}
      </Droppable>
    </div>
  );
}
