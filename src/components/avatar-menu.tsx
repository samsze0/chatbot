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
import { useSupabase } from "@/components/providers";
import { redirect, useRouter } from "next/navigation";

export function AvatarMenu() {
  const session = useSessionStore((state) => state.session);
  const { t } = useTranslation();
  const router = useRouter();
  const supabase = useSupabase();

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
        <DropdownMenuItem>
          <MdOutlineAccountCircle className="mr-2 h-4 w-4 text-muted-foreground" />
          <Link className="text-muted-foreground" href="/account">
            {t("Account")}
          </Link>
          {/* <DropdownMenuShortcut>⌘K</DropdownMenuShortcut> */}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <TbLogout className="mr-2 h-4 w-4 text-muted-foreground" />
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
            {t("Sign out")}
          </Link>
          {/* <DropdownMenuShortcut>⌘K</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
