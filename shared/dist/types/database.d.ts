import type { IResource } from './resource';
import type { IRole } from './role';
import type { IUser } from './user';
export interface IRights {
    roleId: IRole['id'];
    role?: IRole;
    resourceId: IResource['id'];
    resource?: IResource;
    creating: boolean;
    reading: boolean;
    updating: boolean;
    deleting: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IUsersRoles {
    userId: IUser['id'];
    roleId: IRole['id'];
    createdAt?: Date;
}
//# sourceMappingURL=database.d.ts.map