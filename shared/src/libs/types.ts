export type TRoutes<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => string
    ? (...args: A) => string
    : T[K] extends string
      ? string
      : TRoutes<T[K]>;
};

export type WithoutNulls<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};
