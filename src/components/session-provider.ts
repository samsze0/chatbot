import { useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import Cookies from "js-cookie";
import { redirect, usePathname, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const useSessionStore = create<{
  session: Session | null;
}>(() => ({
  session: null,
}));

// function isLocalStorageAvailable() {
//   const test = "test";
//   try {
//     localStorage.setItem(test, test);
//     localStorage.removeItem(test);
//     return true;
//   } catch (e) {
//     return false;
//   }
// }

const NO_AUTH_ROUTES = ["/login", "/signup"];

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { session } = useSessionStore();
  const supabase = createClientComponentClient();
  const pathname = usePathname();

  // TODO: add route protection

  // useEffect(() => {
  //   if (NO_AUTH_ROUTES.includes(pathname) && !session) return;
  //   if (NO_AUTH_ROUTES.includes(pathname) && session) redirect("/");

  //   // Inside one of AUTH_ROUTES
  //   if (!session) redirect("/login");
  // }, [pathname, session]);

  const onSessionChange = (session: Session | null) => {
    useSessionStore.setState({ session });

    // if (session) {
    //   Cookies.set("supabase-token", session.access_token, {
    //     secure: process.env.NODE_ENV === "production",
    //     sameSite: "strict",
    //     expires: new Date(session.expires_at! * 1000),
    //   });
    //   // localStorage.setItem("supabase-refresh-token", session.refresh_token);
    // } else {
    //   Cookies.remove("supabase-token");
    //   // localStorage.removeItem("supabase-refresh-token");
    // }
  };

  useEffect(() => {
    // if (!navigator.cookieEnabled) {
    //   alert("Please enable cookies to use this site"); // TODO: show as notification
    // }

    // if (!isLocalStorageAvailable()) {
    //   alert("Please enable local storage to use this site"); // TODO: show as notification
    // }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // console.info("auth change event", event, session);

      // if (
      //   event !== "SIGNED_IN" &&
      //   event !== "SIGNED_OUT" &&
      //   event !== "TOKEN_REFRESHED"
      // )
      //   return;

      onSessionChange(session);
      // router.refresh();
    });

    return () => subscription.unsubscribe();
    // }, [supabase]);
  }, []);

  return children;
};
