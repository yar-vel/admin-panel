import { ESortOrder } from './constants';

export interface IReqList<T extends object> {
  reqLimit?: number;
  reqPage?: number;
  reqCount?: boolean;
  reqSortField?: keyof T;
  reqSortOrder?: ESortOrder;
}

export interface IResList<
  T extends object,
  S extends object = T,
  F extends object = T,
> {
  rows: T[];
  meta?: IResListMeta<T, S, F>;
}

export interface IResListMeta<
  T extends object,
  S extends object = T,
  F extends object = T,
> {
  page?: number;
  limit?: number;
  total?: number;
  sort?: ISort<S>;
  filters?: Partial<F>;
}

export interface ISort<T extends object> {
  field: keyof T;
  order: ESortOrder;
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
