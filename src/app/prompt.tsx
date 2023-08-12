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
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/components/settings";
import usePersistedStore from "@/components/use-persisted-store";

export const usePromptStore = create<{
  open: boolean;
}>((set) => ({
  open: false,
}));

export function Prompt({
  className,
  input,
  handleInputChange,
  handleSubmit,
  ...props
}: {
  className?: string;
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const { t } = useTranslation();
  const { open } = usePromptStore();
  const openPromptHotkey = usePersistedStore(
    useSettingsStore,
    (state) => state.openPromptHotkey
  );
  const openPromptHotkeyRef = useRef(openPromptHotkey);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === openPromptHotkeyRef.current && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        usePromptStore.setState({ open: true });
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    openPromptHotkeyRef.current = openPromptHotkey;
  }, [openPromptHotkey]);

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            className,
            "flex flex-row gap-2 items-center justify-between py-5 px-3"
          )}
          onClick={(e) => {
            usePromptStore.setState({ open: true });
          }}
        >
          {t("Prompt")}
          <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium flex">
            <span className="text-xs">⌘</span>
            {openPromptHotkey?.toUpperCase()}
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-[80%] h-[80%] p-0 border-0 shadow-none bg-transparent"
        showDefaultCloseButton={false}
        onEscapeKeyDown={(e) => {
          usePromptStore.setState({ open: false });
        }}
        onInteractOutside={(e) => {
          usePromptStore.setState({ open: false });
        }}
        onPointerDownOutside={(e) => {
          usePromptStore.setState({ open: false });
        }}
      >
        <form
          onSubmit={(e) => {
            handleSubmit(e);
            usePromptStore.setState({ open: false });
          }}
          className="flex flex-col gap-5 bg-background"
        >
          <Textarea
            className="flex-1 resize-none text-base text-foreground/80 leading-relaxed focus-visible:ring-0 focus-visible:outline-none outline-none ring-0"
            value={input}
            placeholder={t("Prompt")}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.metaKey && !e.altKey && !e.ctrlKey) {
                if (e.shiftKey) {
                  return;
                }

                // @ts-ignore
                e.target.form.requestSubmit();
                e.preventDefault();
              }
            }}
          />
          <div className="flex flex-row gap-2 self-end">
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={(e) => {
                  usePromptStore.setState({ open: false });
                }}
              >
                {t("Close")}
              </Button>
            </DialogClose>
            <Button type="submit" variant="default">
              {t("Submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
