"use client";

import {
  Button,
  Keybind,
  Translation,
  useHotkey,
  usePersistedStore,
} from "@artizon/ui";
import { useTranslation } from "react-i18next";
import { FormEvent, useEffect, useRef } from "react";
import { useSettings } from "@/components/settings";
import { PromptDialogStackItem, usePromptDialogStack } from "./dialog-stack";
import { PromptDialog } from "./dialog";

export function PromptDialogStackTrigger() {
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
      tooltipContent={<Keybind hotkey={hotkey} />}
    >
      <Translation asChild>Prompt</Translation>
    </Button>
  );
}
