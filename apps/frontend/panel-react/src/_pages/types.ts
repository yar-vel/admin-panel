import { ILayout } from "@/widgets/layout/types";

export type TPage<T = void> = ILayout &
  (T extends void ? { data?: never } : { data: T });
