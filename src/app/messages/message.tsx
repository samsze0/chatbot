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

export const Message = ({ message }: { message: MessageType }) => {
  const isUser = message.role === "user";

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
        <Translation className="text-xs text-muted-foreground/80">
          {isUser ? "User" : "Bot"}
        </Translation>
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
              <TooltipContent>
                <Translation asChild>Copy</Translation>
              </TooltipContent>
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
