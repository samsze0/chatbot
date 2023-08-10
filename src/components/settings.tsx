"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Close as DialogClose } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cn } from "@/lib/utils";
import {
  CatchHotkeyDialog,
  useCatchHotkeyDialogStore,
} from "@/components/catch-hotkey-dialog";
import usePersistedStore from "@/components/usePersistedStore";
import * as z from "zod";

export const useSettingsStore = create<{
  open: boolean;
  openSettingsHotkey: string;
  openPromptHotkey: string;
  openCommandMenuHotkey: string;
}>()(
  persist(
    (set) => ({
      open: false,
      openSettingsHotkey: ",",
      openPromptHotkey: "p",
      openCommandMenuHotkey: "k",
    }),
    {
      name: "settings-storage",
      partialize: ({
        openCommandMenuHotkey,
        openPromptHotkey,
        openSettingsHotkey,
      }) => ({ openCommandMenuHotkey, openPromptHotkey, openSettingsHotkey }),
      merge: (persisted, current) => {
        if (!persisted) return current;

        const parseResult = z
          .object({
            openCommandMenuHotkey: z.string(),
            openPromptHotkey: z.string(),
            openSettingsHotkey: z.string(),
          })
          .safeParse(persisted);

        if (!parseResult.success) {
          console.error(parseResult.error);
          return current;
        }

        return { ...current, ...parseResult.data };
      },
    }
  )
);

export function Settings({ className, ...props }: { className?: string }) {
  const { t } = useTranslation();
  const open = useSettingsStore((state) => state.open);
  const openSettingsHotkey = usePersistedStore(
    useSettingsStore,
    (state) => state.openSettingsHotkey
  );
  const openPromptHotkey = usePersistedStore(
    useSettingsStore,
    (state) => state.openPromptHotkey
  );
  const openCommandMenuHotkey = usePersistedStore(
    useSettingsStore,
    (state) => state.openCommandMenuHotkey
  );
  const openSettingsHotkeyRef = useRef(openSettingsHotkey);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === openSettingsHotkeyRef.current && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        useSettingsStore.setState({ open: true });
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    openSettingsHotkeyRef.current = openSettingsHotkey;
  }, [openSettingsHotkey]);

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            className,
            "relative w-full flex items-center justify-between text-sm text-muted-foreground gap-5 px-2 pl-4 border",
            "transition-none",
            "focus-visible:ring-0 ring-0 outline-none focus-visible:outline-none"
          )}
          onClick={(e) => {
            useSettingsStore.setState({ open: true });
          }}
        >
          {t("Settings")}
          <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium flex">
            <span className="text-xs">⌘</span>
            {openSettingsHotkey?.toUpperCase()}
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="p-5 shadow-none h-[80vh] w-[80vw] flex flex-col"
        onEscapeKeyDown={(e) => {
          useSettingsStore.setState({ open: false });
        }}
        onInteractOutside={(e) => {
          useSettingsStore.setState({ open: false });
        }}
        onPointerDownOutside={(e) => {
          useSettingsStore.setState({ open: false });
        }}
      >
        <DialogHeader>
          <DialogTitle>{t("Settings")}</DialogTitle>
          <DialogDescription>
            {t("All settings are automatically saved.")}
          </DialogDescription>
        </DialogHeader>
        <section className="flex flex-col gap-3 flex-1">
          <h3 className="text-sm text-muted-foreground font-semibold">
            {t("Hotkey")}
          </h3>
          <div className="grid grid-cols-[200px_minmax(900px,1fr)] gap-2 items-center">
            <HotkeyConfig
              inputId="open-settings-hotkey"
              label={t("Open settings")}
              onChange={(value) => {
                useSettingsStore.setState({
                  openSettingsHotkey: value,
                });
              }}
              value={openSettingsHotkey}
            />
            <HotkeyConfig
              inputId="open-prompt-hotkey"
              label={t("Open prompt")}
              onChange={(value) => {
                useSettingsStore.setState({
                  openPromptHotkey: value,
                });
              }}
              value={openPromptHotkey}
            />
            <HotkeyConfig
              inputId="open-command-menu-hotkey"
              label={t("Open command menu")}
              onChange={(value) => {
                useSettingsStore.setState({
                  openCommandMenuHotkey: value,
                });
              }}
              value={openCommandMenuHotkey}
            />
          </div>
          <CatchHotkeyDialog />
        </section>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={(e) => {
              useSettingsStore.setState({ open: false });
            }}
          >
            {t("Close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const HotkeyConfig = ({
  value,
  inputId,
  onChange,
  label,
  ...props
}: {
  value?: string;
  inputId: string;
  onChange: (value: string) => void;
  label: string;
}) => {
  return (
    <>
      <Label htmlFor={inputId} className="text-foreground/80 text-sm">
        {label}
      </Label>
      <div className="flex flex-row gap-2 items-center">
        <kbd className="pointer-events-none select-none rounded border bg-muted h-[25px] w-[25px] font-mono font-medium flex items-center justify-center">
          <span>⌘</span>
        </kbd>
        <kbd
          className="select-none rounded border bg-muted h-[25px] w-[25px] font-mono font-light text-foreground cursor-pointer flex items-center justify-center text-sm"
          onClick={(e) => {
            useCatchHotkeyDialogStore.setState({
              onKeydown: (e) => {
                if (
                  e.key.length === 1 &&
                  !e.metaKey &&
                  !e.altKey &&
                  !e.ctrlKey &&
                  !e.shiftKey
                ) {
                  onChange(e.key);
                  return true;
                }

                return false;
              },
            });
          }}
        >
          <span>{value?.toUpperCase()}</span>
        </kbd>
      </div>
    </>
  );
};
