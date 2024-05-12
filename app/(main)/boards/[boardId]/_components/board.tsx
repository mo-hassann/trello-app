"use client";
import React, { useState, useTransition } from "react";
import { card, list } from "@prisma/client";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import List from "./list";
import NewList from "./new-list";
import { toast } from "@/components/ui/use-toast";
import { reorderListsAction } from "@/actions/list/reorder-lists";
import { useParams, useRouter } from "next/navigation";
import { reorderCardAction } from "@/actions/card/reorder-cards";

export default function Board({
  boardLists,
  isCurUserIsMemberUser,
}: {
  boardLists: (list & { cards: card[] })[];
  isCurUserIsMemberUser: boolean;
}) {
  const [lists, setLists] = useState(boardLists);
  const [cards, setCards] = useState(boardLists.flatMap((list) => list.cards));
  const { boardId } = useParams<{ boardId: string }>();
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();

  // reorder the lists in the board
  const reorderLists = (curIndex: number, newIndex: number) => {
    // check if no movement
    if (curIndex === newIndex) return;

    const myLists = [...lists];

    // reorder item to the new position
    const [reorderedItem] = myLists.splice(curIndex, 1);
    myLists.splice(newIndex, 0, reorderedItem);

    // get the start and the end index to only slice the changes items
    const startIndex = Math.min(curIndex, newIndex);
    const endIndex = Math.max(curIndex, newIndex);
    const itemsToUpdate = myLists.slice(startIndex, endIndex + 1);

    // get only the id and the new index from the changes items
    const bulkUpdateData = itemsToUpdate.map((item) => ({
      id: item.id,
      newIndex: myLists.findIndex((list) => list.id === item.id),
    }));

    // reorder the items in the db
    startTransition(() => {
      reorderListsAction(bulkUpdateData, boardId)
        .then((data) => {
          if (data.success) toast({ description: data.success, variant: "success" });
          if (data.error) toast({ description: data.error, variant: "destructive" });
        })
        .finally(() => {
          router.refresh();
        });
    });

    // reorder the items in the state
    setLists(myLists);
  };

  // reorder the cards in the lists
  const reorderCards = (
    curIndex: number,
    newIndex: number,
    curListId: string,
    newListId: string
  ) => {
    let bulkUpdateData: { id: string; newIndex: number; newListId?: string }[];

    // if the cards moves on the same list only change the position of the cards
    if (curListId === newListId) {
      // check if no movement
      if (curIndex === newIndex) return;

      const curListCards = [...cards.filter((card) => card.listId === curListId)];
      const cardsWithoutCurListCards = [...cards.filter((card) => card.listId !== curListId)];

      const [reorderedItem] = curListCards.splice(curIndex, 1);
      curListCards.splice(newIndex, 0, { ...reorderedItem });

      const startIndex = Math.min(curIndex, newIndex);
      const endIndex = Math.max(curIndex, newIndex);

      const itemsToUpdate = curListCards.slice(startIndex, endIndex + 1);
      bulkUpdateData = itemsToUpdate.map((item) => ({
        id: item.id,
        newIndex: curListCards.findIndex((card) => card.id === item.id),
      }));

      setCards([...cardsWithoutCurListCards, ...curListCards]);
    }

    // if the cards moves to other list, change the position of the cards and the list id of the moved card
    if (curListId !== newListId) {
      const curListCards = cards.filter((card) => card.listId === curListId);
      const newListCards = cards.filter((card) => card.listId === newListId);
      const untouchedCards = cards.filter(
        (card) => card.listId !== curListId && card.listId !== newListId
      );

      const itemsToUpdate = [
        ...curListCards.slice(curIndex, curListCards.length),
        ...newListCards.slice(newIndex, newListCards.length),
      ];

      const [reorderedItem] = curListCards.splice(curIndex, 1);
      newListCards.splice(newIndex, 0, { ...reorderedItem, listId: newListId });

      // making sure to update the index of the cards in the cur list and the new list and if the new list is empty set the index of the card to 0
      bulkUpdateData = itemsToUpdate.map((item) => {
        let newIndex = newListCards.findIndex((card) => card.id === item.id);
        if (newIndex === -1) newIndex = curListCards.findIndex((card) => card.id === item.id);
        if (newIndex === -1) newIndex = 0;

        // if the item is the reordered card set the list id to the new list id
        let listId = undefined;
        if (item.id === reorderedItem.id) listId = newListId;

        return { id: item.id, newIndex, newListId: listId };
      });

      setCards([...untouchedCards, ...curListCards, ...newListCards]);
    }

    startTransition(() => {
      reorderCardAction(bulkUpdateData, boardId)
        .then((data) => {
          if (data.success) toast({ description: data.success, variant: "success" });
          if (data.error) toast({ description: data.error, variant: "destructive" });
        })
        .finally(() => {
          router.refresh();
        });
    });
  };

  const HandleOnDragEnd = (action: DropResult) => {
    if (!action.destination) return;
    if (action.type === "BOARD") reorderLists(action.source.index, action.destination.index);
    if (action.type === "LIST")
      reorderCards(
        action.source.index,
        action.destination.index,
        action.source.droppableId,
        action.destination.droppableId
      );
  };

  return (
    <DragDropContext onDragEnd={HandleOnDragEnd}>
      <Droppable droppableId={`board`} direction="horizontal" type="BOARD">
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
            <div className="flex items-start space-x-5 overflow-x-auto w-full py-3 px-2">
              {lists.map((list, i) => (
                <Draggable
                  key={list.id}
                  draggableId={`${list.id}`}
                  index={i}
                  isDragDisabled={!isCurUserIsMemberUser}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <List
                        key={list.id}
                        id={list.id}
                        listName={list.name}
                        cards={cards
                          .filter((card) => card?.listId === list.id)
                          .sort((card) => card.index)}
                        isCurUserIsMemberUser={isCurUserIsMemberUser}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {isCurUserIsMemberUser && <NewList />}
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
