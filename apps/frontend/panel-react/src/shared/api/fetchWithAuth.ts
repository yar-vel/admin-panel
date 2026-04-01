import { isClient } from "../lib/utils";
import { FetchError } from "./FetchError";
import { getApiUrl } from "./getApiUrl";
import { refreshToken } from "./refreshToken";

let refreshTokenPromise: ReturnType<typeof refreshToken> | null = null;

export const fetchWithAuth = async (
  url: string,
  options: Omit<RequestInit, "body"> & {
    body?: unknown;
    params?: unknown;
  } = {},
): Promise<Response> => {
  const apiUrl = getApiUrl();
  const finalUrl =
    apiUrl +
    url.substring(apiUrl.endsWith("/") && url.startsWith("/") ? 1 : 0) +
    (options.params
      ? "?" + new URLSearchParams(options.params as Record<string, string>)
      : "");
  const finalOptions: RequestInit = {
    ...options,
    headers: {
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  let response = await fetch(finalUrl, finalOptions);

  if (response.status === 401) {
    if (isClient() && !refreshTokenPromise) {
      refreshTokenPromise = refreshToken().finally(() => {
        refreshTokenPromise = null;
      });
    }

    await refreshTokenPromise;
    response = await fetch(finalUrl, finalOptions);
  }

  if (!response.ok) throw new FetchError(response);

  return response;
};
