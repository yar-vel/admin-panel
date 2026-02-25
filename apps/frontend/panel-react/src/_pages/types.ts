export type TPage<T = void> = {
  h1?: string;
} & ([T] extends [void] ? { data?: never } : { data: T });
