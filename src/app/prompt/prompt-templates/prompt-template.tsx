"use client";

import {
  Button,
  Checkbox,
  Textarea,
  Translation,
  cn,
  tw,
  useToast,
} from "@artizon/ui";
import { TbPencilCog } from "react-icons/tb";
import { HiOutlineTrash } from "react-icons/hi";
import { usePromptDialogStack } from "../dialog-stack";
import { EditPromptTemplateDialog, useEditPromptDialog } from "./edit-dialog";

const labelStyles = tw`text-sm text-muted-foreground`;

export const PromptTemplate = ({
  template,
  deleteTemplate,
}: {
  template: Database["public"]["Tables"]["prompt_templates"]["Row"];
  deleteTemplate: () => Promise<void>;
}) => {
  const { push } = usePromptDialogStack();
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-4 p-4 rounded-sm border-muted border relative">
      <div
        className={cn("absolute top-4 right-4", "flex flex-row items-center")}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            useEditPromptDialog.setState({
              currentTemplate: template,
            });
            push(EditPromptTemplateDialog);
          }}
        >
          <TbPencilCog
            className="w-5 h-5 text-muted-foreground"
            strokeWidth={1}
          />
        </Button>
        {/* TODO: loading state for deleting */}
        <Button
          variant="ghost"
          size="icon"
          onClick={async () => {
            try {
              await deleteTemplate();
            } catch (e) {
              console.error(e);
              toast({
                title: "Fail to delete prompt template",
                description:
                  "Please check your internet connection. Otherwise, please contact the administrator.",
                variant: "destructive",
              });
            }
          }}
        >
          <HiOutlineTrash
            className="w-5 h-5 text-muted-foreground"
            strokeWidth={1}
          />
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        <Translation className={cn(labelStyles, "text-xs")}>
          Template name
        </Translation>
        <Translation>{template.name}</Translation>
      </div>
      <Textarea
        value={template.prompt_template}
        readOnly
        className="min-h-[150px] text-muted-foreground"
      ></Textarea>
      <div className="flex flex-row gap-2 items-center">
        <Translation className={labelStyles}>Is public?</Translation>
        <Checkbox checked={template.is_public} disabled />
      </div>
    </div>
  );
};
