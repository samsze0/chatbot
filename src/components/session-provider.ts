import { useEffect, useState } from "react";
import { supabase } from "@/components/providers";
import { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import Cookies from "js-cookie";
import { redirect, useRouter } from "next/navigation";

export const useSessionStore = create<{
  session: Session | null;
}>(() => ({
  session: null,
}));

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();

  const onSessionChange = (session: Session | null) => {
    useSessionStore.setState({ session });

    if (session) {
      Cookies.set("supabase-token", session.access_token, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(session.expires_at! * 1000),
      });
    } else {
      Cookies.remove("supabase-token");
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.info("auth change event", event, session);

      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT") return;

      onSessionChange(session);
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, []);

  return children;
};
