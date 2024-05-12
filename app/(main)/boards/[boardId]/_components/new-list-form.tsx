"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { createNewList } from "@/actions/list/new-list";
import { toast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";

import { DialogFooter } from "@/components/ui/dialog";
import { newListFromSchema } from "@/validation";

type dataType = z.infer<typeof newListFromSchema>;

export default function NewListFrom() {
  const form = useForm<dataType>({
    resolver: zodResolver(newListFromSchema),
    defaultValues: {
      name: "",
    },
  });
  const [isLoading, startTransition] = useTransition();
  const { boardId } = useParams<{ boardId: string }>();

  const onSubmit = (values: dataType) => {
    startTransition(() => {
      createNewList(values, boardId).then((data) => {
        if (data.success) toast({ description: data.success, variant: "success" });
        if (data.error) toast({ description: data.error, variant: "destructive" });
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="list name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button className="self-end" disabled={isLoading} type="submit">
            Submit
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
