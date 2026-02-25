export interface IReqList<T = unknown> {
  reqLimit?: number;
  reqPage?: number;
  reqCount?: boolean;
  reqSortField?: T extends object ? keyof T : string;
  reqSortOrder?: 'ASC' | 'DESC';
}

export interface IResList<T = unknown, S = T, F = T> {
  rows: T[];
  meta?: IResListMeta<T, S, F>;
}

export interface IResListMeta<T = unknown, S = T, F = T> {
  page?: number;
  limit?: number;
  total?: number;
  sort?: ISort<S>;
  filters?: F extends object ? Partial<F> : { [K: string]: unknown };
}

export interface ISort<T = unknown> {
  field: T extends object ? keyof T : string;
  order: 'ASC' | 'DESC';
}

export interface IReqItems<T = string | number> {
  items: T[];
}

export interface IFetchUpdate<
  T = unknown,
  U = T extends { id: infer P } ? P : string | number,
> {
  id: U;
  fields: T;
}
