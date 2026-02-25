"use server";

import { headers } from "next/headers";

import { IFetchRes, IFetchArgs } from "./types";
import { authService } from "@/entities/auth/service";
import { getField } from "@ap/shared/dist/libs";

const query = async <T>(
  url: string,
  options: RequestInit,
): Promise<IFetchRes<T>> => {
  try {
    const res = await fetch(url, options);

    if (res.status >= 400) {
      return { data: null, error: res.status };
    }

    return {
      data: res.status === 204 ? null : await res.json(),
      error: null,
      newCookiesRaw: res.headers.getSetCookie(),
    };
  } catch (err) {
    return { data: null, error: Number(getField(err, "statusCode")) || null };
  }
};

export const serverFetch = async <T = unknown>(
  payload: IFetchArgs,
): Promise<IFetchRes<T>> => {
  const baseUrl = process.env.API_HOST_INTERNAL ?? "";
  const headersList = await headers();
  const optionsHeaders = new Headers({
    "user-agent": headersList.get("user-agent") ?? "",
    cookie: headersList.get("cookie") ?? "",
  });
  const options: RequestInit = {
    ...payload,
    body: payload.body ? JSON.stringify(payload.body) : undefined,
    headers: optionsHeaders,
  };

  if (headersList.has("set-cookie")) {
    optionsHeaders.set(
      "cookie",
      (optionsHeaders.has("cookie")
        ? optionsHeaders.get("cookie") + "; "
        : "") +
        headersList
          .get("set-cookie")!
          .split(",")
          .map((cookie) => {
            const [key, value] = cookie.split(";", 1)[0].split("=");
            return key + "=" + (value ?? "");
          })
          .join("; "),
    );
  }

  if (payload.headers instanceof Headers) {
    payload.headers.forEach((v, k) => optionsHeaders.set(k, v));
  } else if (payload.headers) {
    Object.entries(payload.headers).forEach(([k, v]) =>
      optionsHeaders.set(k, v),
    );
  }

  const result = await query<T>(
    baseUrl +
      payload.url +
      new URLSearchParams(payload.params as Record<string, string>),
    options,
  );

  if (result.error === 401) {
    const refreshArgs = authService.refreshArgs();
    const refreshRes = await query<boolean>(baseUrl + refreshArgs.url, {
      ...refreshArgs,
      body: undefined,
      headers: optionsHeaders,
    });

    if (refreshRes.newCookiesRaw) {
      optionsHeaders.set(
        "cookie",
        (optionsHeaders.has("cookie")
          ? optionsHeaders.get("cookie") + "; "
          : "") +
          refreshRes.newCookiesRaw
            .map((cookie) => {
              const [key, value] = cookie.split(";", 1)[0].split("=");
              return key + "=" + (value ?? "");
            })
            .join("; "),
      );
      options.headers = optionsHeaders;

      return {
        ...(await query<T>(
          baseUrl +
            payload.url +
            new URLSearchParams(payload.params as Record<string, string>),
          options,
        )),
        newCookiesRaw: refreshRes.newCookiesRaw,
      };
    }
  }

  return result;
};
