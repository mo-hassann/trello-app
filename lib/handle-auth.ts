import { auth } from "@clerk/nextjs";

export const handleAuth = async () => {
  const { userId } = auth();
  if (!userId) throw "unauthorized user";

  return { userId };
};
