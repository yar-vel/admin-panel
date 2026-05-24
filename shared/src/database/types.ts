import { IResource } from '../resource';
import { IRole } from '../role';
import { IUser } from '../user';

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
