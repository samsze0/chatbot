"use client";

import {
  Button,
  CustomSetting,
  generateSettingsComp,
  generateUseSettingsStore,
  SettingsHotkey,
} from "@artizon/ui";
import { z } from "zod";
import { RxGear } from "react-icons/rx";
import { useSettingsVisibility } from "@@/components/settings";

export const useSettings = generateUseSettingsStore<{
  toggleCommandMenuHotkey: string;
  togglePromptHotkey: string;
}>({
  toggleCommandMenuHotkey: {
    defaultValue: "k",
    persist: true,
    // @ts-ignore
    schema: z.string().min(1),
  },
  togglePromptHotkey: {
    defaultValue: "p",
    persist: true,
    // @ts-ignore
    schema: z.string().min(1),
  },
});

export const changeToggleCommandMenuHotkey = (key: string) =>
  useSettings.setState({ toggleCommandMenuHotkey: key });

const Comp = generateSettingsComp(useSettings);

export function Settings() {
  const { toggleCommandMenuHotkey } = useSettings();

  return (
    <Comp
      includeTrigger={false}
      hotkeyConfigItems={
        <>
          {/* <SettingsHotkey
            inputId=""
            label="command menu"
            onChange={changeToggleCommandMenuHotkey}
            value={toggleCommandMenuHotkey}
          /> */}
        </>
      }
    />
  );
}

export function SettingsTrigger() {
  const { toggle } = useSettingsVisibility();

  return (
    <Button variant="ghost" size="icon" onClick={toggle}>
      <RxGear className="w-5 h-5" />
    </Button>
  );
}
