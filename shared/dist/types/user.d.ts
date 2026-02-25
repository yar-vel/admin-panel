import { IReqList, IResList } from './api';
import type { IRole } from './role';
import type { WithoutNulls } from './utils';
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
}
export type TUserCreate = WithoutNulls<Required<Pick<IUser, 'email' | 'password' | 'name'>> & Partial<Pick<IUser, 'enabled'>>>;
export type TUserCreateGoogle = WithoutNulls<Required<Pick<IUser, 'googleId' | 'name'>> & Partial<Pick<IUser, 'enabled'>>>;
export type TUserReqListParams = Partial<Pick<IUser, 'email' | 'name' | 'enabled' | 'verified'>>;
export type TUserReqList = IReqList<IUser> & TUserReqListParams;
export type TUserResList = IResList<IUser>;
export type TUserUpdate = Partial<Pick<IUser, 'name' | 'enabled'>>;
//# sourceMappingURL=user.d.ts.map