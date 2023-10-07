import "./globals.css";
import { Metadata } from "next";

import { siteConfig } from "@/config/site-config";
import { Analytics } from "@/components/analytics";
import { Providers } from "@/components/providers";
import { Toaster, I18Dropdown, cn, AvatarMenu } from "@artizon/ui";
import {
  generateNextMetadata,
  NextLayout,
  nextAppContainerStyles,
} from "@artizon/ui/next";
import {
  NextSiteFooterWithSupabase,
  NextSiteHeaderWithSupabase,
  NextAvatarMenuWithSupabase,
} from "@artizon/ui/next-client-components";
import { NextThemeToggle } from "@artizon/ui/next-client-components";
import { ReactNode } from "react";
import { navConfig } from "@/config/nav-config";
import Link from "next/link";
import { Settings, SettingsTrigger } from "@/components/settings";

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-fields
export const metadata: Metadata = generateNextMetadata(siteConfig);

export const dynamic = "force-dynamic";

// TODO: add 404 page & React suspense and error boundary for server components

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <NextLayout>
      <Providers>
        <div className={cn(nextAppContainerStyles)}>
          <Settings />
          <NextSiteHeaderWithSupabase
            protectedRouteOnly
            linkComp={Link}
            navConfig={navConfig}
            siteConfig={siteConfig}
            rightSideItems={
              <>
                <NextThemeToggle />
                <SettingsTrigger />
                <span />
                <NextAvatarMenuWithSupabase />
              </>
            }
          />
          <div className={cn("flex-1 flex child:flex-1")}>{children}</div>
        </div>
      </Providers>
      <Analytics />
      <Toaster />
    </NextLayout>
  );
}
