"use client";

import {
  Button,
  CustomSetting,
  generateSettingsComp,
  generateUseSettingsStore,
  generateSettingsTriggerComp,
  SettingsHotkey,
  usePersistedStore,
} from "@artizon/ui";
import { z } from "zod";
import { RxGear } from "react-icons/rx";

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
  const toggleCommandMenuHotkey = usePersistedStore(
    useSettings,
    // @ts-ignore
    (state) => state.toggleCommandMenuHotkey
  );

  return (
    <Comp
      hotkeyConfigItems={
        <>
          <SettingsHotkey
            inputId=""
            label="command menu"
            onChange={changeToggleCommandMenuHotkey}
            value={toggleCommandMenuHotkey}
          />
        </>
      }
    />
  );
}

export const SettingsTrigger = generateSettingsTriggerComp(useSettings);
