"use client";

import { Translation } from "@artizon/ui";
import { Message } from "./message";
import { Message as MessageType } from "ai/react";

export function Messages({ messages }: { messages: MessageType[] }) {
  // const { t } = useTranslation();
  const { t } = { t: (t: string) => t };

  return (
    <>
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full w-full">
          <Translation className="text-sm text-muted-foreground">
            Chat is empty
          </Translation>
        </div>
      ) : (
        <div className="container relative pt-8 pb-8 flex flex-col gap-2 items-stretch">
          {messages.length > 0
            ? messages.map((m) => <Message message={m} key={m.id} />)
            : null}
        </div>
      )}
    </>
  );
}
