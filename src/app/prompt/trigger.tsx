"use client";

import { Button, useHotkey, usePersistedStore } from "@artizon/ui";
import { useTranslation } from "react-i18next";
import { FormEvent, useEffect, useRef } from "react";
import { useSettings } from "@/components/settings";
import { PromptDialogStackItem, usePromptDialogStack } from "./dialog-stack";
import { PromptDialog } from "./dialog";

export function PromptDialogStackTrigger({
  className,
}: {
  className?: string;
}) {
  // const { t } = useTranslation();
  const { t } = { t: (t: string) => t };

  const hotkey = usePersistedStore(
    useSettings,
    // @ts-ignore
    (state) => state.togglePromptHotkey
  );

  const { push } = usePromptDialogStack();

  useHotkey(hotkey, () => {
    // Ignore action if dialog stack is opened
    if (usePromptDialogStack.getState().stack.length > 0) return;

    push(PromptDialog);
  });

  return (
    <Button
      onClick={() => push(PromptDialog)}
      variant="outline"
      className="gap-2"
    >
      <span>{t("Prompt")}</span>
      <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium flex">
        <span className="text-xs">⌘</span>
        {hotkey?.toUpperCase()}
      </kbd>
    </Button>
  );
}
