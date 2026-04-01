import type { TResourceReqList } from "@workspace/shared";

export const resourceKeys = {
  all: () => ["resources"] as const,
  details: () => [...resourceKeys.all(), "detail"] as const,
  detail: (id: string) => [...resourceKeys.details(), id] as const,
  lists: () => [...resourceKeys.all(), "list"] as const,
  list: (params?: TResourceReqList) =>
    [...resourceKeys.lists(), params] as const,
} as const;
