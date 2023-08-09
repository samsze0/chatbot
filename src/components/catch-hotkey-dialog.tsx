"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { create } from "zustand";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export const useCatchHotkeyDialogStore = create<{
  onKeydown?: (e: KeyboardEvent) => boolean;
}>((set) => ({
  onKeydown: undefined,
}));

export const CatchHotkeyDialog = ({ ...props }) => {
  const { onKeydown } = useCatchHotkeyDialogStore();
  const currentKeydownHandler = useRef<((e: KeyboardEvent) => void) | null>(
    null
  );
  const { t } = useTranslation();

  useEffect(() => {
    if (currentKeydownHandler.current) {
      document.removeEventListener("keydown", currentKeydownHandler.current);
    }

    if (!onKeydown) return;

    const onKey = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      if (onKeydown(e)) {
        useCatchHotkeyDialogStore.setState({ onKeydown: undefined });
      }
    };

    document.addEventListener("keydown", onKey);
    currentKeydownHandler.current = onKey;
  }, [onKeydown]);

  return (
    <Dialog open={!!onKeydown}>
      <DialogContent
        className="p-5 shadow-none flex flex-col items-center justify-center"
        onEscapeKeyDown={(e) => {
          useCatchHotkeyDialogStore.setState({ onKeydown: undefined });
        }}
        onInteractOutside={(e) => {
          useCatchHotkeyDialogStore.setState({ onKeydown: undefined });
        }}
        onPointerDownOutside={(e) => {
          useCatchHotkeyDialogStore.setState({ onKeydown: undefined });
        }}
      >
        <p className="text-sm text-muted-foreground">
          {t("Waiting for keystroke...")}
        </p>
      </DialogContent>
    </Dialog>
  );
};
