import { handleAuth } from "@/lib/handle-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  cardAttachment: f(["audio", "image", "text", "pdf", "video"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  boardImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
