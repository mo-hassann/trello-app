"use client";
import { editWorkspaceImgAction } from "@/actions/workspace/edit-workspaceImg";
import { toast } from "@/components/ui/use-toast";
import { UploadDropzone } from "@/utils/uploadthing";
import { editWorkspaceImgSchema } from "@/validation";
import { useParams } from "next/navigation";
import React, { startTransition } from "react";
import { z } from "zod";

export default function EditWorkspaceImg() {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const handleFileUpload = (data: { url: string }) => {
    startTransition(() => {
      editWorkspaceImgAction(data, workspaceId).then((data) => {
        if (data.success) toast({ description: data.success, variant: "success" });
        if (data.error) toast({ description: data.error, variant: "destructive" });
      });
    });
  };
  return (
    <div>
      <UploadDropzone
        className="bg-muted"
        endpoint="workspaceImage"
        onClientUploadComplete={(res: any) => {
          console.log(res);
          const url: string | null = res && res[0]?.url;
          if (!url) return null;
          handleFileUpload({ url });
        }}
        onUploadError={(error: any) => {
          console.log("uploadthing error from client");
          toast({ description: error.message, variant: "destructive" });
        }}
      />
    </div>
  );
}
