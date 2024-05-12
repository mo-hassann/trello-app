"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import { editBoardFormSchema } from "@/validation";
import { editWorkspace } from "@/actions/workspace/edit-workspace";
import { editBoard } from "@/actions/board/edit-board";

type dataType = z.infer<typeof editBoardFormSchema>;

export default function EditBoardNameForm({
  boardName,
  setIsEditing,
}: {
  boardName: string;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm<dataType>({
    resolver: zodResolver(editBoardFormSchema),
    defaultValues: {
      name: boardName,
    },
  });
  const {
    setFocus,
    formState: { isDirty },
  } = form;
  const [isLoading, startTransition] = useTransition();
  const { boardId } = useParams<{ boardId: string }>();

  const onSubmit = (values: dataType) => {
    startTransition(() => {
      editBoard(values, boardId)
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
