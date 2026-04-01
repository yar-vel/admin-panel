import { cookies, headers } from "next/headers";

export const getServerHeaders = async (): Promise<HeadersInit> => {
  const cookiesList = await cookies();
  const headersList = await headers();
  const userAgentHeader = headersList.get("user-agent") ?? undefined;

  const cookieMap = new Map<string, string>();
  cookiesList.getAll().forEach(({ name, value }) => {
    cookieMap.set(name, value);
  });

  const setCookieHeader = headersList.get("set-cookie");

  if (setCookieHeader) {
    setCookieHeader.split(",").forEach((cookie) => {
      const [pair] = cookie.split(";");
      const [name, value] = pair.trim().split("=");
      if (name) cookieMap.set(name.trim(), value?.trim() ?? "");
    });
  }

  const cookieHeader = Array.from(cookieMap.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");

  return {
    ...(cookieHeader ? { cookie: cookieHeader } : {}),
    ...(userAgentHeader ? { "user-agent": userAgentHeader } : {}),
  };
};
