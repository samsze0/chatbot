"use client";

import { useSessionStore } from "@/components/session-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  PromptTemplateEditDialog,
  usePromptTemplateEditDialogStore,
} from "./prompt-template-edit-dialog";

export default function Page() {
  const { t } = useTranslation();
  const supabase = createClientComponentClient<Database>();

  const { session } = useSessionStore();

  const promptTemplatesQuery = useQuery({
    // @ts-ignore
    queryKey: ["profile"],
    queryFn: () =>
      supabase
        .from("prompt_templates")
        .select()
        .eq("id", session!.user.id)
        .throwOnError()
        .then(({ data }) => data),
    enabled: !!session?.user,
  });

  return (
    <div className="relative flex flex-col gap-8 container mt-8 mb-8">
      <PromptTemplateEditDialog />
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-xl">{t("Prompt Templates")}</h1>
        <div className="flex flex-row gap-2">
          <Button
            variant="default"
            className={cn(
              "focus-visible:ring-0 ring-0 outline-none focus-visible:outline-none"
            )}
            onClick={(e) => {
              usePromptTemplateEditDialogStore.setState({ open: true, mode: "create" });
            }}
          >
            {t("Add new")}
          </Button>
        </div>
      </div>
      <div className="grid columns-3 gap-3">
        {promptTemplatesQuery.data
          ? promptTemplatesQuery.data.map((template) => (
              <PromptTemplate key={template.id} template={template} />
            ))
          : null}
      </div>
    </div>
  );
}

const PromptTemplate = ({
  template,
}: {
  template: Database["public"]["Tables"]["prompt_templates"]["Row"];
}) => {
  const { t } = useTranslation();

  return <div>Testing</div>;
};
