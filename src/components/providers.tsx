"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

import { TooltipProvider } from "@/components/ui/tooltip";

import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import { translations } from "@/config/translations";
import { createClient } from "@supabase/supabase-js";
import { SessionProvider } from "@/components/session-provider";

i18n.use(initReactI18next).init({
  resources: translations,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <SessionProvider>
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      </SessionProvider>
    </NextThemesProvider>
  );
}
