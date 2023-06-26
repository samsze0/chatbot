import { translations } from "@/config/translations";
import { NextProviders } from "@artizon/ui/next-client-components";
import { ReactNode } from "react";
import { ExtraProviders } from "./extra-providers";

export async function Providers({ children }: { children: ReactNode }) {
  return (
    <NextProviders translations={translations}>
      <ExtraProviders>{children}</ExtraProviders>
    </NextProviders>
  );
}
