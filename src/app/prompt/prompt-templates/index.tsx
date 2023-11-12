"use client";

import {
  createClientComponentClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import {
  EditDialogFormSchema,
  EditPromptTemplateDialog,
  useEditPromptDialog,
} from "./edit-dialog";
import { cn, Button, Translation } from "@artizon/ui";
import { cookies } from "next/headers";
import { PromptTemplate } from "./prompt-template";
import { useSupabaseSession } from "@artizon/ui/next-client-components";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { DialogTitle } from "@artizon/ui";
import { createContext, useEffect } from "react";
import { PromptDialogStackItem, usePromptDialogStack } from "../dialog-stack";

export function PromptTemplatesDialog(props) {
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

  const { push } = usePromptDialogStack();

  async function deleteTemplate(id: string) {
    await supabase
      .from("prompt_templates")
      .delete()
      .eq("id", id)
      .throwOnError();

    // TODO: separate out refetching from the deleteTemplate function
    await promptTemplatesReq.refetch();
  }

  useEffect(() => {
    async function upsertTemplate(
      { isPublic, name, promptTemplate }: z.infer<typeof EditDialogFormSchema>,
      id?: string
    ) {
      if (!id)
        await supabase
          .from("prompt_templates")
          .insert([
            {
              creator_user_id: session!.user.id,
              name: name,
              is_public: isPublic,
              prompt_template: promptTemplate,
            },
          ])
          .select()
          .throwOnError();
      else
        await supabase
          .from("prompt_templates")
          .update({
            name: name,
            is_public: isPublic,
            prompt_template: promptTemplate,
          })
          .eq("id", id)
          .select()
          .throwOnError();

      useEditPromptDialog.setState({
        currentTemplate: undefined,
      });

      // TODO: separate out refetching from the upsertTemplate function
      await promptTemplatesReq.refetch();
    }

    useEditPromptDialog.setState({
      upsertTemplate,
    });
  }, [session, supabase, promptTemplatesReq]);

  return (
    <PromptDialogStackItem {...props}>
      {/* <Button
        variant="default"
        onClick={() => {
          useEditPromptDialog.setState({
            currentTemplate: undefined,
          });
          push(EditPromptTemplateDialog);
        }}
      >
        <Translation asChild>Add new</Translation>
      </Button> */}
      {promptTemplatesReq.data?.length ? (
        <div
          className={cn(
            // "grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6",
            "flex flex-col gap-6",
            "overflow-y-auto"
          )}
        >
          {promptTemplatesReq.data.map((template) => (
            <PromptTemplate
              key={template.id}
              template={template}
              deleteTemplate={() => deleteTemplate(template.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Translation className="text-sm text-muted-foreground">
            No prompt templates available
          </Translation>
        </div>
      )}
    </PromptDialogStackItem>
  );
}
