"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useChat, Message as MessageType } from "ai/react";
import { useTranslation } from "react-i18next";
import { RxCopy } from "react-icons/rx";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Prompt } from "./prompt";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const { t } = useTranslation();

  return (
    <div className="relative">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full w-full">
          <p className="text-sm text-muted-foreground">{t("Chat is empty")}</p>
        </div>
      ) : (
        <ScrollArea
          className={cn(
            "container relative pt-8 pb-8 max-h-[80vh]",
            "flex flex-col items-center justify-center"
          )}
        >
          <div className="flex flex-col gap-2 items-stretch">
            {messages.length > 0
              ? messages.map((m) => <Message message={m} key={m.id} />)
              : null}
          </div>
        </ScrollArea>
      )}
      <Prompt
        className="absolute bottom-8 right-8"
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

const Message = ({ message, ...props }: { message: MessageType }) => {
  const isUser = message.role === "user";
  const { t } = useTranslation();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <div
      className={cn(
        "relative border rounded px-4 py-3 flex flex-col gap-1",
        isUser
          ? "bg-primary/10 border-primary/[15%]"
          : "bg-destructive/10 border-destructive/[15%]"
      )}
    >
      <div className="flex flex-row justify-between gap-2">
        <p className="text-xs text-muted-foreground/80">
          {isUser ? t("User") : t("Bot")}
        </p>
        <div className={cn("flex flex-row gap-1")}>
          <Button
            variant="ghost"
            className="p-0 h-[25px] w-[25px]"
            size="icon"
            onClick={(e) => copyToClipboard()}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <RxCopy className="w-[15px] h-[15px] text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent>{t("Copy")}</TooltipContent>
            </Tooltip>
          </Button>
        </div>
      </div>
      <p
        className={cn("whitespace-pre-wrap text-foreground/75 leading-relaxed")}
      >
        {message.content}
      </p>
    </div>
  );
};
