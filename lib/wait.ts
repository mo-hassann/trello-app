export const wait = (sec: number) => {
  return new Promise((res) => {
    setTimeout(() => {
      res("done");
    }, sec * 1000);
  });
};
