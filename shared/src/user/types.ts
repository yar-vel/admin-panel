import { IReqList, IResList } from '../api';
import { WithoutNulls } from '../libs';
import { IRole } from '../role';

export interface IUser {
  id: string;
  email?: string | null;
  password?: string | null;
  name: string;
  googleId?: string | null;
  enabled: boolean;
  verified: boolean;
  verificationCode?: string | null;
  resetPasswordCode?: string | null;
  changeEmailCode?: string | null;
  temporaryEmail?: string | null;
  roles?: IRole[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type TUserCreate = WithoutNulls<
  Required<Pick<IUser, 'email' | 'password' | 'name'>> &
    Partial<Pick<IUser, 'enabled'>>
>;

export type TUserCreateGoogle = WithoutNulls<
  Required<Pick<IUser, 'googleId' | 'name'>> & Partial<Pick<IUser, 'enabled'>>
>;

export type TUserReqListParams = Partial<
  Pick<IUser, 'email' | 'name' | 'enabled' | 'verified'>
>;

export type TUserReqList = IReqList<IUser> & TUserReqListParams;

export type TUserResList = IResList<IUser>;

export type TUserUpdate = Partial<Pick<IUser, 'name' | 'enabled'>>;
