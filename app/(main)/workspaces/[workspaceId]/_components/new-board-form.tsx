"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import { createNewBoard } from "@/actions/board/new-board";
import { DialogFooter } from "@/components/ui/dialog";
import { newBoardFromSchema } from "@/validation";

type dataType = z.infer<typeof newBoardFromSchema>;

export default function NewBoardFrom() {
  const form = useForm<dataType>({
    resolver: zodResolver(newBoardFromSchema),
    defaultValues: {
      name: "",
      boardColor: "",
    },
  });
  const [isLoading, startTransition] = useTransition();
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const onSubmit = (values: dataType) => {
    startTransition(() => {
      createNewBoard(values, workspaceId).then((data) => {
        if (data.success) toast({ description: data.success, variant: "success" });
        if (data.error) toast({ description: data.error, variant: "destructive" });
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="board name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="boardColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl className="w-10 p-0 *:p-0">
                  <Input type="color" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button className="self-end" disabled={isLoading} type="submit">
            Submit
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
