import { FindManyOptions } from 'typeorm';

export type TDatabaseGetList<T = unknown> = Pick<
  FindManyOptions<T>,
  'skip' | 'take' | 'where' | 'order' | 'relations'
>;
