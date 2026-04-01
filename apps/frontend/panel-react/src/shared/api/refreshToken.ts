import { ROUTES } from "@workspace/shared";
import { FetchError } from "./FetchError";
import { getApiUrl } from "./getApiUrl";

export const refreshToken = async (headers?: HeadersInit) => {
  const apiUrl = getApiUrl();
  const finalUrl =
    apiUrl +
    ROUTES.api.auth.refresh.substring(
      apiUrl.endsWith("/") && ROUTES.api.auth.refresh.startsWith("/") ? 1 : 0,
    );
  const response = await fetch(finalUrl, {
    method: "GET",
    credentials: "include",
    headers,
  });

  if (!response.ok) throw new FetchError(response);

  return response.headers.getSetCookie();
};
