import type { TRoleReqList } from "@workspace/shared/dist/types";

export const roleKeys = {
  all: () => ["roles"] as const,
  details: () => [...roleKeys.all(), "detail"] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
  lists: () => [...roleKeys.all(), "list"] as const,
  list: (params?: TRoleReqList) => [...roleKeys.lists(), params] as const,
} as const;
