"use client";

import { translations } from "@/config/translations";
import { NextProviders } from "@artizon/ui/next-client-components";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextProviders translations={translations}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NextProviders>
  );
}
