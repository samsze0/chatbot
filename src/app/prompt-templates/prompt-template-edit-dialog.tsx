"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSessionStore } from "@/components/session-provider";
import { cn } from "@/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { create } from "zustand";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export const usePromptTemplateEditDialogStore = create<{
  open: boolean;
  mode: "create" | "edit";
}>((set) => ({
  open: false,
  mode: "create",
}));

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Prompt template name must have at least 3 characters",
  }),
  promptTemplate: z.string().refine(
    (val) => {
      const match = val.match(/\{\{prompt\}\}/);
      return match;
    },
    {
      message: "Prompt template must contain the '{{prompt}}' phrase",
    }
  ),
  isPublic: z.boolean(),
});

export function PromptTemplateEditDialog() {
  const { t } = useTranslation();
  const { open, mode } = usePromptTemplateEditDialogStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      promptTemplate: "",
      isPublic: false,
    },
  });

  const isFormValidRef = useRef(form.formState.isValid);

  useEffect(() => {
    isFormValidRef.current = form.formState.isValid;
  }, [form.formState.isValid]);

  async function onSubmit(values: z.infer<typeof formSchema>) {}

  return (
    <Dialog open={open}>
      <DialogContent
        className="p-5 shadow-none h-[80vh] w-[80vw] flex flex-col"
        onEscapeKeyDown={(e) => {
          usePromptTemplateEditDialogStore.setState({ open: false });
        }}
        onInteractOutside={(e) => {
          usePromptTemplateEditDialogStore.setState({ open: false });
        }}
        onPointerDownOutside={(e) => {
          usePromptTemplateEditDialogStore.setState({ open: false });
        }}
      >
        <DialogHeader className="gap-1">
          <DialogTitle>
            {mode === "create"
              ? t("Create prompt template")
              : t("Edit prompt template")}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? t("Click create to create the template")
              : t("Click save to apply the changes")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5 flex-1"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder={"Prompt name"} {...field} />
                  </FormControl>
                  <FormDescription>
                    {t("Give it a descriptive name.")}
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="promptTemplate"
              render={({ field, fieldState, formState }) => (
                <FormItem className="flex-1 flex flex-col">
                  <Textarea
                    className={cn(
                      "flex-1 resize-none text-sm text-foreground/80 leading-relaxed",
                      fieldState.error ? "border-error" : ""
                    )}
                    placeholder={t("Prompt template")}
                    disabled={formState.isSubmitting}
                    {...field}
                  />
                  <FormDescription>
                    {t("Prompt template must contain the '{{prompt}}' phrase")}
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-2 leading-none">
                    <FormLabel className="text-foreground/80">
                      {t("Is public?")}
                    </FormLabel>
                    <FormDescription>
                      {t(
                        "If checked, this prompt template will be visible to other users."
                      )}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={(e) => {
                  usePromptTemplateEditDialogStore.setState({ open: false });
                }}
              >
                {t("Close")}
              </Button>
              <Button type="submit">
                {mode === "create" ? t("Create") : t("Save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
