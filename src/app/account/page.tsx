"use client";

import { useSessionStore } from "@/components/session-provider";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();
  const supabase = createClientComponentClient<Database>();

  const { session } = useSessionStore();

  const profileQuery = useQuery({
    // @ts-ignore
    queryKey: ["profile"],
    queryFn: () =>
      supabase
        .from("profiles")
        .select()
        .eq("id", session!.user.id)
        .throwOnError()
        .single()
        .then(({ data }) => data),
    enabled: !!session?.user,
  });

  return (
    // <div className="relative container grid grid-cols-[300px_minmax(100px,1fr)] gap-5">
    <div className="relative container flex flex-col gap-8 mt-8 mb-8">
      {/* <div className="border-r border-r-muted"></div> */}
      <h1 className="text-xl">{t("Account settings")}</h1>
      <div
        className={cn(
          "grid auto-rows-min gap-3 items-center",
          "grid-cols-[80px_minmax(100px,1fr)] lg:grid-cols-[160px_minmax(100px,1fr)]"
        )}
      >
        <span className="text-sm text-muted-foreground">{t("Username")}</span>
        <Input value={profileQuery.data?.username ?? ""} readOnly />
        <span className="text-sm text-muted-foreground">{t("Email")}</span>
        <Input value={session?.user?.email ?? ""} readOnly />
      </div>
    </div>
  );
}
