import { isClient } from "../lib/utils";

export const getApiUrl = () =>
  (isClient()
    ? process.env.API_HOST_EXTERNAL
    : process.env.API_HOST_INTERNAL) ?? "";
