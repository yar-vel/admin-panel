export const isTokenExpiredOrExpiringSoon = (
  token: string | undefined,
  bufferSeconds = 30,
): boolean => {
  if (!token) {
    return true;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString(),
    );
    const expiresAt = payload.exp * 1000;
    const now = Date.now();

    return expiresAt - now < bufferSeconds * 1000;
  } catch {
    return true;
  }
};

export const isClient = () => typeof window !== "undefined";
