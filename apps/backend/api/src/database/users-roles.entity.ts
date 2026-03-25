import { CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

import { USERS_ROLES_TABLE } from 'libs/constants';
import { IRole, IUser, IUsersRoles } from '@workspace/shared/dist/types';

@Entity(USERS_ROLES_TABLE)
export class UsersRolesEntity implements IUsersRoles {
  @PrimaryColumn('uuid')
  userId: IUser['id'];

  @PrimaryColumn('uuid')
  roleId: IRole['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
