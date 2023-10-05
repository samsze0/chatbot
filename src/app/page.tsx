"use client";

import {
  Button,
  Input,
  Textarea,
  ScrollArea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
  Translation,
  useToast,
} from "@artizon/ui";
import { useChat, Message as MessageType } from "ai/react";
import { RxCopy } from "react-icons/rx";
import { PromptDialogStack, PromptDialogStackTrigger } from "./prompt";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@artizon/ui";
import { useEffect, useState } from "react";
import { Messages } from "./messages";
import { usePromptDialog } from "./prompt/dialog";

export default function Page() {
  const [model, setModel] = useState<string>("gpt-3.5-turbo");
  const { messages, append, isLoading, stop, error } = useChat({
    api: `/api/chat${model ? `?model=${model}` : ""}`,
  });
  // const { t } = useTranslation();
  const { t } = { t: (t: string) => t };

  const { toast } = useToast();

  useEffect(() => {
    if (error)
      toast({
        title: "Fail to generate response",
        description: "Please confirm that your API token is valid.",
        variant: "destructive",
      });
  }, [error, toast]);

  useEffect(() => {
    const submitPrompt = (prompt) => {
      if (isLoading)
        throw Error("Chatbot is generating his response. Please wait.");

      return append({
        content: prompt,
        role: "user",
        createdAt: new Date(),
      });
    };

    usePromptDialog.setState({ submitPrompt });
  }, [append, isLoading]);

  return (
    <>
      <PromptDialogStack />
      <div className="relative">
        <Messages messages={messages} />
        <div className="fixed bottom-8 right-8 flex md:flex-row flex-col gap-5">
          <Select onValueChange={setModel} defaultValue={model}>
            <SelectTrigger
              className={cn(
                "w-[200px] bg-background",
                !model ? "text-muted-foreground/80" : "text-foreground/80"
              )}
            >
              <SelectValue placeholder={t("Select a model")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-3.5-turbo">OpenAI GPT 3.5 Turbo</SelectItem>
              <SelectItem value="gpt-4">OpenAI GPT 4</SelectItem>
            </SelectContent>
          </Select>
          <PromptDialogStackTrigger />
        </div>
      </div>
    </>
  );
}
