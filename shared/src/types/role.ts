import { IReqList, IResList } from './api';
import type { IRights } from './database';
import type { IUser } from './user';

export interface IRole {
  id: string;
  name: string;
  description?: string | null;
  enabled: boolean;
  admin: boolean;
  default: boolean;
  users?: IUser[];
  rights?: IRights[];
}

export type TRoleCreate = Required<Pick<IRole, 'name'>> &
  Partial<Pick<IRole, 'description' | 'enabled'>>;

export type TRoleReqListParams = Partial<
  Pick<IRole, 'name' | 'enabled' | 'default' | 'admin'>
>;

export type TRoleReqList = IReqList<IRole> & TRoleReqListParams;

export type TRoleResList = IResList<IRole>;

export type TRoleUpdate = Partial<
  Pick<IRole, 'name' | 'description' | 'enabled'>
>;
