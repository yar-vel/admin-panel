export type TFetchPayload<T> = MaybeRef<
  T extends object ? { [K in keyof T]: TFetchPayload<T[K]> } : T
>
