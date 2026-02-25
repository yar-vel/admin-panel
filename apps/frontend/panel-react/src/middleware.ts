import { NextMiddleware, NextResponse } from "next/server";

import { IUser } from "@ap/shared/dist/types";
import { profileService } from "./entities/profile/service";
import { ROUTES } from "./shared/lib/constants";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      // originalSource:
      //   '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

export const middleware: NextMiddleware = async (request) => {
  /**
   * NOTE
   *
   * This check allows you to avoid repeated work by the middleware.
   * if (request.headers.has('referer')) return;
   * But it had to be disabled, since server requests on pages in Next.js
   * are not able to change headers, which may contain new pairs of tokens.
   * For this reason, you have to make a request below every time you visit a new page.
   */

  const accessToken = request.cookies.get("accessToken");
  const refreshToken = request.cookies.get("refreshToken");
  let profile: IUser | null = null;
  let newCookiesRaw: string[] | null | undefined = null;
  let response = NextResponse.next();
  const isAuthRoute =
    request.nextUrl.pathname === ROUTES.ui.signIn ||
    request.nextUrl.pathname === ROUTES.ui.signInGoogle ||
    request.nextUrl.pathname === ROUTES.ui.signUp ||
    request.nextUrl.pathname === ROUTES.ui.forgotPassword;

  if (accessToken || refreshToken) {
    ({ data: profile, newCookiesRaw } = await profileService.getProfile());
  }

  if (profile) {
    if (isAuthRoute) {
      const searchParams = new URLSearchParams(request.nextUrl.search);
      response = NextResponse.redirect(
        new URL(
          decodeURIComponent(searchParams.get("return") || ROUTES.ui.home),
          request.url,
        ),
        { status: 302 },
      );
    }

    response.headers.set(
      "store-profile",
      encodeURIComponent(JSON.stringify(profile)),
    );
  } else {
    if (!isAuthRoute && !request.headers.has("referer")) {
      response = NextResponse.redirect(
        new URL(
          `${ROUTES.ui.signIn}?return=${encodeURIComponent(
            request.nextUrl.pathname,
          )}`,
          request.url,
        ),
        302,
      );
    }
  }

  if (newCookiesRaw) {
    newCookiesRaw.forEach((cookie) => {
      response.headers.append("set-cookie", cookie);
    });
  }

  return response;
};
