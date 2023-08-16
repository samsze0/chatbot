// TODO: protect routes from server-side (respond with redirect)

import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { User, createClient } from "@supabase/supabase-js";

import { NextRequest } from "next/server";

// https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

export async function middleware(req: NextRequest) {
  const authResult = await getUser(req);
  const isLoginRoute =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/signup");

  if (authResult.error) {
    if (isLoginRoute) return NextResponse.next();

    if (req.nextUrl.pathname.startsWith("/api"))
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );

    // https://nextjs.org/docs/messages/middleware-relative-urls
    return NextResponse.redirect(
      // new URL(`/login?redirect=${encodeURIComponent(req.url)}`, req.url)
      new URL(`/login`, req.nextUrl.origin)
    );
  }

  if (isLoginRoute) {
    return NextResponse.redirect(new URL(`/`, req.nextUrl.origin));
  }

  const res = NextResponse.next();
  return res;
}

interface AuthResult {
  user: User | null;
  error: null | string;
}

async function getUser(req: NextRequest): Promise<AuthResult> {
  const token = req.cookies.get("supabase-token");
  if (!token) {
    return {
      user: null,
      error: "There is no supabase token in request cookies",
    };
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );

  const userResponse = await supabase.auth.getUser(token.value);

  if (userResponse.error) {
    return {
      user: null,
      error: userResponse.error.message,
    };
  }

  return {
    user: userResponse.data.user,
    error: null,
  };
}
