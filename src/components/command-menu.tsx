"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DialogProps } from "@radix-ui/react-alert-dialog";
import {
  CircleIcon,
  FileIcon,
  LaptopIcon,
  MoonIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { navConfig } from "@/config/nav-config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useTranslation } from "react-i18next";
import { useSettingsStore } from "@/components/settings";
import { useCallback, useEffect, useRef } from "react";
import usePersistedStore from "@/components/use-persisted-store";

export function CommandMenu({ ...props }: DialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { setTheme } = useTheme();
  const { t } = useTranslation();
  const openMenuHotkey = usePersistedStore(
    useSettingsStore,
    (state) => state.openCommandMenuHotkey
  );
  const openMenuHotkeyRef = useRef(openMenuHotkey);

  useEffect(() => {
    openMenuHotkeyRef.current = openMenuHotkey;
  }, [openMenuHotkey]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === openMenuHotkeyRef.current && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64",
          "transition-none"
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">{t("Type a command...")}</span>
        <span className="inline-flex lg:hidden">{t("Command...")}</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>
          {openMenuHotkey?.toUpperCase()}
        </kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        onEscapeKeyDown={(e) => {
          setOpen(false);
        }}
      >
        <CommandInput placeholder={t("Type a command...")} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {/* <CommandGroup heading={t("Links")}>
            {navConfig.mainNav
              .filter((navitem) => !navitem.external)
              .map((navItem) => (
                <CommandItem
                  key={`mainNav-${navItem.href}`}
                  value={navItem.title}
                  onSelect={() => {
                    runCommand(() => router.push(navItem.href as string));
                  }}
                >
                  <FileIcon className="mr-2 h-4 w-4" />
                  {t(navItem.title)}
                </CommandItem>
              ))}
          </CommandGroup> */}
          {/* {navConfig.sidebarNav.map((group) => (
            <CommandGroup key={group.title} heading={t(group.title)}>
              {group.items.map((navItem) => (
                <CommandItem
                  key={`sidebarNav-${navItem.href}`}
                  value={navItem.title}
                  onSelect={() => {
                    runCommand(() => router.push(navItem.href as string));
                  }}
                >
                  <div className="mr-2 flex h-4 w-4 items-center justify-center">
                    <CircleIcon className="h-3 w-3" />
                  </div>
                  {t(navItem.title)}
                </CommandItem>
              ))}
            </CommandGroup>
          ))} */}
          {/* <CommandSeparator /> */}
          <CommandGroup heading={t("Theme")}>
            {/* <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <SunIcon className="mr-2 h-4 w-4" />
              {t("Light Theme")}
            </CommandItem> */}
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <MoonIcon className="mr-2 h-4 w-4" />
              {t("Dark Theme")}
            </CommandItem>
            {/* <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <LaptopIcon className="mr-2 h-4 w-4" />
              {t("System Theme")}
            </CommandItem> */}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
