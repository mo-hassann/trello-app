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
  isCurUserIsMemberUser: boolean;
};

export default function List({ id, listName, cards, isCurUserIsMemberUser }: ListProps) {
  return (
    <div className="rounded-lg p-3 bg-muted text-muted-foreground w-[310px] max-h-[600px] overflow-y-auto flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-2 bg-primary rounded-full" />
          <h2 className="text-lg font-semibold text-foreground capitalize">{listName}</h2>
          <div className="flex items-center justify-center text-xs font-semibold rounded-full size-5 text-muted-foreground bg-muted-foreground/30">
            <span>{cards.length}</span>
          </div>
        </div>
        {isCurUserIsMemberUser && (
          <Button className="p-0 hover:bg-slate-200/20 size-8 text-sm" variant="ghost">
            <MoreHorizontalIcon />
          </Button>
        )}
      </div>
      <div className="w-full h-[3px] bg-primary rounded-full my-4" />
      <Droppable droppableId={`${id}`} type="LIST">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            className={cn(
              "border border-hidden",
              snapshot.isDraggingOver &&
                "border-dashed border-muted-foreground bg-muted-foreground/10 rounded-md"
            )}
            {...provided.droppableProps}
          >
            <div className="flex flex-col space-y-3 my-4 p-1">
              {cards.length === 0 && (
                <p className="italic text-center text-muted-foreground">no cards here 😥</p>
              )}
              {cards.length > 0 &&
                cards.map((card, i) => (
                  <Draggable
                    key={card.id}
                    draggableId={`${card.id}`}
                    index={i}
                    isDragDisabled={!isCurUserIsMemberUser}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-background rounded-xl p-4 hover:border-primary flex justify-between"
                      >
                        <CardContent title={card.title} />
                        {isCurUserIsMemberUser && (
                          <Button
                            variant="ghost"
                            className="p-2 bg-slate-200/20 hover:bg-primary hover:text-white size-8 text-xs rounded-full"
                          >
                            <Pen />
                          </Button>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
            </div>
            {provided.placeholder}
            {isCurUserIsMemberUser && <NewCardForm listId={id} />}
          </div>
        )}
      </Droppable>
    </div>
  );
}
