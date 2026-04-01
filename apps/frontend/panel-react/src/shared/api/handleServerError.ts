import { notFound } from "next/navigation";

import { FetchError } from "@/shared/api/FetchError";

export const handleServerError = async <T>(
  fn: () => Promise<T>,
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof FetchError) {
      switch (error.status) {
        // NOTE: experimental
        // case 401:
        //   return unauthorized();
        // case 403:
        //   return forbidden();
        case 404:
          return notFound();
        default:
          return notFound();
      }
    }

    throw error;
  }
};
