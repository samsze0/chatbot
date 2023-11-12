"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Textarea,
  usePersistedStore,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
  generateModalVisibilityStore,
  useHotkey,
  HotkeyTogglableDialog,
  Translation,
  useToast,
} from "@artizon/ui";
import { useTranslation } from "react-i18next";
import { FormEvent, createContext, useContext, useEffect, useRef } from "react";
import { create } from "zustand";
import { useSettings } from "@/components/settings";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { TbPencilCog } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { useSupabaseSession } from "@artizon/ui/next-client-components";
import { PromptTemplatesDialog } from "./prompt-templates";
import { PromptDialogStackItem, usePromptDialogStack } from "./dialog-stack";

export const usePromptDialog = create<{
  submitPrompt: (prompt: string) => Promise<string | null | undefined>;
}>(() => ({
  submitPrompt: async () => null,
}));

const formSchema = z.object({
  prompt: z.string().min(3),
  promptTemplate: z.string(),
});

export function PromptDialog(props) {
  // const { t } = useTranslation();
  const { t } = { t: (t: string) => t };

  const { submitPrompt } = usePromptDialog();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      promptTemplate: "none",
    },
  });

  const isFormValidRef = useRef(form.formState.isValid);

  const supabase = createClientComponentClient<Database>();
  const session = useSupabaseSession(supabase);

  const promptTemplatesReq = useQuery({
    // @ts-ignore
    queryKey: ["prompt-templates"],
    queryFn: () =>
      supabase
        .from("prompt_templates")
        .select()
        .eq("creator_user_id", session!.user.id)
        .throwOnError()
        .then(({ data }) => {
          return data;
        }),
    enabled: !!session,
  });

  useEffect(() => {
    isFormValidRef.current = form.formState.isValid;
  }, [form.formState.isValid]);

  const { toast } = useToast();

  const { push, pop } = usePromptDialogStack();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // FIX: not focusing
    textareaRef.current?.focus();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const template =
      values.promptTemplate === "none"
        ? {
            prompt_template: "{{prompt}}",
          }
        : promptTemplatesReq.data.find(
            (template) => template.id === values.promptTemplate
          );
    if (!template) {
      toast({
        title: "Fail to retrieve prompt template details",
        description: "Please contact the site administrator.",
        variant: "destructive",
      });
      throw Error(`Prompt template ${values.promptTemplate} not found`);
    }

    const fullPrompt = template.prompt_template.replace(
      /\{\{prompt\}\}/,
      values.prompt
    );

    pop(); // Close current dialog

    try {
      await submitPrompt(fullPrompt);
      form.resetField("prompt");
      form.clearErrors();
    } catch (e) {
      form.setError("prompt", {
        message: "Invalid prompt",
      });
    }
  }

  return (
    <PromptDialogStackItem {...props}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full h-full flex flex-col gap-5 bg-background"
        >
          <FormField
            control={form.control}
            name="prompt"
            render={({ field, fieldState, formState }) => (
              <Textarea
                className={cn(
                  "flex-1 resize-none text-base text-foreground/80 leading-relaxed",
                  "focus-visible:ring-0 focus-visible:outline-none outline-none ring-0",
                  fieldState.error ? "border-error" : ""
                )}
                placeholder={t("Prompt")}
                disabled={formState.isSubmitting}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.metaKey &&
                    !e.altKey &&
                    !e.ctrlKey
                  ) {
                    if (e.shiftKey) {
                      return;
                    }

                    if (isFormValidRef.current)
                      // @ts-ignore
                      e.target.form.requestSubmit();

                    e.preventDefault();
                  }
                }}
                ref={textareaRef}
                {...field}
              />
            )}
          />
          <div className="flex flex-row gap-2 self-end">
            {/* <Button variant="outline" onClick={pop}>
              {t("Close")}
            </Button> */}
            <FormField
              control={form.control}
              name="promptTemplate"
              render={({ field, fieldState, formState }) => (
                <FormItem>
                  {/* TODO: add loading state for Select */}
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "w-[200px]",
                          "focus-visible:ring-0 focus-visible:outline-none outline-none ring-0 focus:ring-0",
                          !field.value
                            ? "text-muted-foreground/80"
                            : "text-foreground/80"
                        )}
                        disabled={formState.isSubmitting}
                      >
                        <SelectValue
                          placeholder={t("Select a prompt template")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {promptTemplatesReq.data?.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Button
              variant="outline"
              onClick={() => push(PromptTemplatesDialog)}
            >
              {t("Edit templates")}
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {t("Submit")}
            </Button>
          </div>
        </form>
      </Form>
    </PromptDialogStackItem>
  );
}
