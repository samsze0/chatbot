"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  cn,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  Textarea,
  Checkbox,
  Input,
  useToast,
} from "@artizon/ui";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { create } from "zustand";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useEffect, useRef } from "react";
import { PromptDialogStackItem, usePromptDialogStack } from "../dialog-stack";

export const useEditPromptDialog = create<{
  upsertTemplate: (
    values: z.infer<typeof formSchema>,
    id?: string
  ) => Promise<void>;
  currentTemplate?: Database["public"]["Tables"]["prompt_templates"]["Row"];
}>(() => ({
  upsertTemplate: async () => null,
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

export { formSchema as EditDialogFormSchema };

export function EditPromptTemplateDialog(props) {
  // const { t } = useTranslation();
  const { t } = { t: (t: string) => t };
  const { upsertTemplate, currentTemplate } = useEditPromptDialog();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentTemplate?.name ?? "",
      promptTemplate: currentTemplate?.prompt_template ?? "",
      isPublic: currentTemplate?.is_public ?? false,
    },
  });

  const isFormValidRef = useRef(form.formState.isValid);

  useEffect(() => {
    isFormValidRef.current = form.formState.isValid;
  }, [form.formState.isValid]);

  const { toast } = useToast();

  const { pop } = usePromptDialogStack();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await upsertTemplate(values, currentTemplate?.id);
      toast({
        title: `Successfully ${
          currentTemplate ? "edit" : "add new"
        } prompt template`,
      });
      pop();
    } catch(e) {
      console.error(e);
      toast({
        title: `Fail to ${
          currentTemplate ? "edit" : "add new"
        } prompt template`,
        description:
          "Please check your internet connection. Otherwise, please contact the administrator.",
        variant: "destructive",
      });
    }
  }

  return (
    <PromptDialogStackItem {...props}>
      <div className="flex flex-col gap-1">
        <DialogTitle>
          {!currentTemplate
            ? t("Create prompt template")
            : t("Edit prompt template")}
        </DialogTitle>
        <DialogDescription>
          {!currentTemplate
            ? t("Click create to create the template")
            : t("Click save to apply the changes")}
        </DialogDescription>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 flex-1"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState, formState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={"Prompt name"}
                    disabled={formState.isSubmitting}
                    {...field}
                    className={cn(fieldState.error ? "border-error" : "")}
                  />
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
            render={({ field, formState }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    disabled={formState.isSubmitting}
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
          <div className="flex flex-row gap-2 justify-end">
            <Button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {!currentTemplate ? t("Create") : t("Save")}
            </Button>
          </div>
        </form>
      </Form>
    </PromptDialogStackItem>
  );
}
