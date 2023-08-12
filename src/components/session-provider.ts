import { useEffect, useState } from "react";
import { supabase } from "@/components/providers";
import { Session } from "@supabase/supabase-js";
import { redirect, usePathname, useRouter } from "next/navigation";
import { create } from "zustand";

export const useSessionStore = create<{
  session: Session | null;
}>(() => ({
  session: null,
}));

const NO_AUTH_ROUTES = ["/login", "/signup"];

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const { session } = useSessionStore();
  const router = useRouter();

  useEffect(() => {
    if (NO_AUTH_ROUTES.includes(pathname) && !session) return;
    if (NO_AUTH_ROUTES.includes(pathname) && session) redirect("/");

    // Inside one of AUTH_ROUTES
    if (!session) redirect("/login");
  }, [pathname, session]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      useSessionStore.setState({ session });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      useSessionStore.setState({ session });
    });

    return () => subscription.unsubscribe();
  }, []);

  return children;
};
