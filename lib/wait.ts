export const wait = (sec: number) => {
  return new Promise((res) => {
    setTimeout(() => {
      res("done");
    }, sec * 1000);
  });
};

/*        .map((item) => ({
          id: item.id,
          name: item.title,
          newIndex: newListCards.findIndex((card) => card.id === item.id),
        }))
        .map((item) => ({
          ...item,
          newIndex:
            item.newIndex === -1
              ? curListCards.findIndex((card) => card.id === item.id)
              : item.newIndex,
        }))
        .map((item) => ({ ...item, newIndex: item.newIndex === -1 ? 0 : item.newIndex }))
        .map((item) => ({
          ...item,
          newListId: item.id === reorderedItem.id ? newListId : undefined,
        })); */
