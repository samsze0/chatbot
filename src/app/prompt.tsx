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
import { Close as DialogClose } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { FormEvent, useEffect, useRef } from "react";
import { create } from "zustand";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/components/settings";
import usePersistedStore from "@/components/use-persisted-store";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

const formSchema = z.object({
  prompt: z.string().min(3),
  promptTemplate: z.string(),
});

export const usePromptStore = create<{
  open: boolean;
}>((set) => ({
  open: false,
}));

export function Prompt({
  className,
  submitPrompt,
  ...props
}: {
  className?: string;
  submitPrompt: (prompt: string) => Promise<string | null | undefined>;
}) {
  const { t } = useTranslation();
  const { open } = usePromptStore();
  const openPromptHotkey = usePersistedStore(
    useSettingsStore,
    (state) => state.openPromptHotkey
  );
  const openPromptHotkeyRef = useRef(openPromptHotkey);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isFormValidRef = useRef(form.formState.isValid);

  const supabase = createClientComponentClient<Database>();

  const promptTemplatesQuery = useQuery({
    // @ts-ignore
    queryKey: ["prompt-templates"],
    queryFn: () =>
      supabase
        .from("prompt_templates")
        .select()
        .throwOnError()
        .then(({ data }) => {
          console.log(data);
          return data;
        }),
  });

  useEffect(() => {
    isFormValidRef.current = form.formState.isValid;
  }, [form.formState.isValid]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const fullPrompt = values.promptTemplate.replace(
      /\{\{prompt\}\}/,
      values.prompt
    );
    usePromptStore.setState({ open: false });

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

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === openPromptHotkeyRef.current && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        usePromptStore.setState({ open: true });
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    openPromptHotkeyRef.current = openPromptHotkey;
  }, [openPromptHotkey]);

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            className,
            "flex flex-row gap-2 items-center justify-between py-5 px-3",
            "focus-visible:ring-0 ring-0 outline-none focus-visible:outline-none"
          )}
          onClick={(e) => {
            usePromptStore.setState({ open: true });
          }}
        >
          {t("Prompt")}
          <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium flex">
            <span className="text-xs">⌘</span>
            {openPromptHotkey?.toUpperCase()}
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-[80%] h-[80%] p-0 border-0 shadow-none bg-transparent focus:ring-0 focus:outline-none ring-0 outline-none"
        showDefaultCloseButton={false}
        onEscapeKeyDown={(e) => {
          usePromptStore.setState({ open: false });
        }}
        onInteractOutside={(e) => {
          usePromptStore.setState({ open: false });
        }}
        onPointerDownOutside={(e) => {
          usePromptStore.setState({ open: false });
        }}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5 bg-background"
          >
            <div className="flex flex-row gap-2 self-end items-center">
              <Link
                href="/prompt-templates"
                className="text-sm text-foreground/60 hover:text-foreground/80 ml-2 mr-2"
              >
                {t("Edit Templates")}
              </Link>
              <FormField
                control={form.control}
                name="promptTemplate"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            "min-w-[150px]",
                            "focus-visible:ring-0 focus-visible:outline-none outline-none ring-0 focus:ring-0",
                            !field.value
                              ? "text-muted-foreground/80"
                              : "text-foreground/80"
                          )}
                        >
                          <SelectValue
                            placeholder={t("Select a prompt template")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="{{prompt}}">None</SelectItem>
                        {promptTemplatesQuery.data
                          ? promptTemplatesQuery.data.map((template) => (
                              <SelectItem
                                key={template.id}
                                value={template.prompt_template}
                              >
                                {template.name}
                              </SelectItem>
                            ))
                          : null}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
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
                  {...field}
                />
              )}
            />
            <div className="flex flex-row gap-2 self-end">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    usePromptStore.setState({ open: false });
                  }}
                >
                  {t("Close")}
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="default"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                {t("Submit")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
