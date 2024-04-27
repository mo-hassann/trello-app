import { auth } from "@clerk/nextjs";

export const handleAuth = async () => {
  const { userId } = auth();
  if (!userId) throw new Error("unauthorized user");

  return { userId };
};
