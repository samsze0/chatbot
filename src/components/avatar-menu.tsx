"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSessionStore } from "@/components/session-provider";
import { useTranslation } from "react-i18next";
import { TbLogout } from "react-icons/tb";
import { MdOutlineAccountCircle } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { redirect, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function AvatarMenu() {
  const session = useSessionStore((state) => state.session);
  const { t } = useTranslation();
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-[35px] h-[35px] border border-background cursor-pointer">
          <AvatarImage src={"/content/test.jpeg"} />
          <AvatarFallback className="text-sm">
            {session?.user.id.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[150px]">
        <DropdownMenuItem asChild>
          <Link className="text-muted-foreground" href="/account">
            <MdOutlineAccountCircle className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{t("Account")}</span>
          </Link>
          {/* <DropdownMenuShortcut>⌘K</DropdownMenuShortcut> */}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            className="text-muted-foreground"
            onClick={(e) => {
              e.preventDefault();
              if (!supabase)
                throw Error("Supabase client not found.");

              supabase.auth.signOut();
            }}
            href="/login"
          >
            <TbLogout className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{t("Sign out")}</span>
          </Link>
          {/* <DropdownMenuShortcut>⌘K</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
