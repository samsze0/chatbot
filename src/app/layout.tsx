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
import { CommandMenu, CommandMenuTrigger } from "@/components/command-menu";

export const metadata: Metadata = generateNextMetadata(siteConfig);

export const dynamic = "force-dynamic";

// TODO: add 404 page & React suspense and error boundary for server components

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <NextLayout>
      <Providers>
        <div className={cn(nextAppContainerStyles)}>
          <Settings />
          <CommandMenu />
          <NextSiteHeaderWithSupabase
            protectedRouteOnly
            linkComp={Link}
            navConfig={navConfig}
            siteConfig={siteConfig}
            rightSideItems={
              <>
                <CommandMenuTrigger />
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
