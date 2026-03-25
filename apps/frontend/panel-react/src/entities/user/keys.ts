import type { TUserReqList } from "@workspace/shared/dist/types";

export const userKeys = {
  all: () => ["users"] as const,
  details: () => [...userKeys.all(), "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  lists: () => [...userKeys.all(), "list"] as const,
  list: (params?: TUserReqList) => [...userKeys.lists(), params] as const,
} as const;
