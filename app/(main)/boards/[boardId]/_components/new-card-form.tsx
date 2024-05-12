"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { createNewCard } from "@/actions/card/new-card";
import { newCardFromSchema } from "@/validation";

type dataType = z.infer<typeof newCardFromSchema>;

export default function NewCardForm({ listId }: { listId: string }) {
  const form = useForm<dataType>({
    resolver: zodResolver(newCardFromSchema),
    defaultValues: {
      title: "",
    },
  });
  const [isLoading, startTransition] = useTransition();
  const { boardId } = useParams<{ boardId: string }>();
  const [isActive, setIsActive] = useState(false);

  const onSubmit = (values: dataType) => {
    startTransition(() => {
      createNewCard(values, listId)
        .then((data) => {
          if (data.success) toast({ description: data.success, variant: "success" });
          if (data.error) toast({ description: data.error, variant: "destructive" });
        })
        .finally(() => {
          form.reset();
          setIsActive(false);
        });
    });
  };

  useEffect(() => {
    if (isActive) form.setFocus("title");
  }, [form, isActive]);

  return (
    <>
      {isActive && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className={"py-7 text-lg"} placeholder="card title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-3 self-end">
              <Button variant="ghost" onClick={() => setIsActive(false)}>
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                Add
              </Button>
            </div>
          </form>
        </Form>
      )}
      {!isActive && (
        <Button className="w-full" onClick={() => setIsActive(true)}>
          <Plus />
          &nbsp;new card
        </Button>
      )}
    </>
  );
}
