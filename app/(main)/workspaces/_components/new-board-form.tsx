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
import { newBoardFormSchema } from "@/validation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type dataType = z.infer<typeof newBoardFormSchema>;

export default function NewBoardFrom() {
  const form = useForm<dataType>({
    resolver: zodResolver(newBoardFormSchema),
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
        <div className="flex flex-col gap-3">
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
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-3"
                  >
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem
                          value="rgba(220 38 38)"
                          className="size-7 bg-red-600 *:opacity-0 data-[state=checked]:border"
                        />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem
                          value="rgba(22 163 74)"
                          className="size-7 bg-green-600 *:opacity-0 *:data-[state=checked]:border"
                        />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem
                          value="rgba(250 204 21)"
                          className="size-7 bg-yellow-400 *:opacity-0 *:data-[state=checked]:border"
                        />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem
                          value="rgb(234 88 12)"
                          className="size-7 bg-orange-600 *:opacity-0 *:data-[state]:"
                        />
                      </FormControl>
                    </FormItem>
                  </RadioGroup>
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
