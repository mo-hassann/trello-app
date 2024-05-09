import { auth } from "@/auth";

export const handleAuth = async () => {
  const session = await auth();
  if (!session) throw new Error("unauthorized user");

  return { userId: session.user?.id };
};

export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};
