import { NextProxy, NextResponse } from "next/server";

import { isTokenExpiredOrExpiringSoon } from "./shared/lib/utils";
import { refreshToken } from "./shared/api/refreshToken";
import { ROUTES } from "@workspace/shared";
import { getServerHeaders } from "./shared/api/getServerHeaders ";

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
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

export const proxy: NextProxy = async (request) => {
  const accessTokenCookie = request.cookies.get("accessToken");
  const refreshTokenCookie = request.cookies.get("refreshToken");
  const isAuthRoute =
    request.nextUrl.pathname === ROUTES.ui.signIn ||
    request.nextUrl.pathname === ROUTES.ui.signInGoogle ||
    request.nextUrl.pathname === ROUTES.ui.signUp ||
    request.nextUrl.pathname === ROUTES.ui.forgotPassword;
  let response = NextResponse.next();
  let isAuthorized = false;

  if (accessTokenCookie || refreshTokenCookie) {
    isAuthorized = true;

    if (
      isTokenExpiredOrExpiringSoon(accessTokenCookie?.value) &&
      refreshTokenCookie
    ) {
      try {
        const newCookies = await refreshToken(await getServerHeaders());
        newCookies.forEach((cookie) => {
          response.headers.append("set-cookie", cookie);
        });
      } catch {
        isAuthorized = false;
      }
    }
  }

  if (isAuthorized && isAuthRoute) {
    const searchParams = new URLSearchParams(request.nextUrl.search);
    response = NextResponse.redirect(
      new URL(
        decodeURIComponent(searchParams.get("return") || ROUTES.ui.home),
        request.url,
      ),
      { status: 302 },
    );
  } else if (!isAuthorized && !isAuthRoute) {
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

  return response;
};
