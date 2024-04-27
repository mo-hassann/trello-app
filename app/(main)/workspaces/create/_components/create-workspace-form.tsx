"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { createWorkspace } from "@/actions/workspace/new-workspace";
import { newWorkspaceFormSchema } from "@/validation";

type dataType = z.infer<typeof newWorkspaceFormSchema>;

export default function CreateWorkspaceFrom() {
  const form = useForm<dataType>({
    resolver: zodResolver(newWorkspaceFormSchema),
    defaultValues: {
      name: "",
    },
  });
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = (values: dataType) => {
    startTransition(() => {
      createWorkspace(values).then((data) => {
        if (data.success) {
          toast({ description: data.success, variant: "success" });
          router.push(`/workspaces/${data.data.id}`);
        }
        if (data.error) toast({ description: data.error, variant: "destructive" });
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>workspace name</FormLabel>
              <FormControl>
                <Input placeholder="workspace name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
