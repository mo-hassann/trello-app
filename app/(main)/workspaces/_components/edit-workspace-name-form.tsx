"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useTransition } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import { editWorkspaceFormSchema } from "@/validation";
import { editWorkspace } from "@/actions/workspace/edit-workspace";

type dataType = z.infer<typeof editWorkspaceFormSchema>;

export default function EditWorkspaceNameForm({
  workspaceName,
  setIsEditing,
}: {
  workspaceName: string;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm<dataType>({
    resolver: zodResolver(editWorkspaceFormSchema),
    defaultValues: {
      name: workspaceName,
    },
  });
  const {
    setFocus,
    formState: { isDirty },
  } = form;
  const [isLoading, startTransition] = useTransition();
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const onSubmit = (values: dataType) => {
    startTransition(() => {
      editWorkspace(values, workspaceId)
        .then((data) => {
          if (data.success) toast({ description: data.success, variant: "success" });
          if (data.error) toast({ description: data.error, variant: "destructive" });
        })
        .finally(() => {
          setIsEditing(false);
        });
    });
  };

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  disabled={isLoading}
                  className="w-[350px] h-[50px] i text-3xl font-semibold"
                  placeholder="my workspace"
                  onBlur={() => {
                    if (isDirty) {
                      form.handleSubmit(onSubmit)();
                    } else {
                      setIsEditing(false);
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
