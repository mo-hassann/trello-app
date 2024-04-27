"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import { editWorkspaceFormSchema } from "@/validation";
import { editWorkspace } from "@/actions/workspace/edit-workspace";
import { Switch } from "@/components/ui/switch";
import Spinner from "@/components/spinner";
import { useMounted } from "@/hooks/useMounted";

type dataType = z.infer<typeof editWorkspaceFormSchema>;

type EditWorkspaceFormProps = { workspaceName: string; isPublic: boolean };

export default function EditWorkspaceForm({ workspaceName, isPublic }: EditWorkspaceFormProps) {
  const form = useForm<dataType>({
    resolver: zodResolver(editWorkspaceFormSchema),
    defaultValues: {
      name: workspaceName,
      isPublic: isPublic,
    },
  });
  const [isLoading, startTransition] = useTransition();
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const isMounted = useMounted();

  const onSubmit = (values: dataType) => {
    startTransition(() => {
      editWorkspace(values, workspaceId)
        .then((data) => {
          if (data.success) toast({ description: data.success, variant: "success" });
          if (data.error) toast({ description: data.error, variant: "destructive" });
        })
        .finally(() => {
          form.reset();
        });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>workspace name</FormLabel>
                <FormControl>
                  <Input
                    className="w-full md:max-w-[500px]"
                    placeholder="my workspace"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>public workspace</FormLabel>
                <FormControl>
                  {isMounted ? (
                    <Switch
                      className="text-4xl data-[state=unchecked]:bg-muted-foreground block"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  ) : (
                    <Spinner />
                  )}
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button className="self-end" disabled={isLoading || !form.formState.isDirty} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
