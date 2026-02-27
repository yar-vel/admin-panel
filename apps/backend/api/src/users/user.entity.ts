import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RoleEntity } from 'src/roles/role.entity';
import { USERS_ROLES_TABLE } from 'libs/constants';
import { IRole, IUser, IUsersRoles } from '@ap/shared/dist/types';
import { EmptyStringToNull } from 'src/database/database.utils';

@Entity('users')
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 320,
    unique: true,
    nullable: true,
    transformer: EmptyStringToNull,
  })
  email?: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    transformer: EmptyStringToNull,
  })
  password?: string | null;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: true,
    transformer: EmptyStringToNull,
  })
  googleId?: string | null;

  @Column({ type: 'boolean', default: false })
  enabled: boolean;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @Column({
    type: 'varchar',
    length: 6,
    nullable: true,
    transformer: EmptyStringToNull,
  })
  verificationCode?: string | null;

  @Column({
    type: 'varchar',
    length: 6,
    nullable: true,
    transformer: EmptyStringToNull,
  })
  resetPasswordCode?: string | null;

  @Column({
    type: 'varchar',
    length: 6,
    nullable: true,
    transformer: EmptyStringToNull,
  })
  changeEmailCode?: string | null;

  @Column({
    type: 'varchar',
    length: 320,
    nullable: true,
    transformer: EmptyStringToNull,
  })
  temporaryEmail?: string | null;

  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable({
    name: USERS_ROLES_TABLE,
    joinColumn: {
      name: 'userId' satisfies keyof IUsersRoles,
      referencedColumnName: 'id' satisfies keyof IUser,
    },
    inverseJoinColumn: {
      name: 'roleId' satisfies keyof IUsersRoles,
      referencedColumnName: 'id' satisfies keyof IRole,
    },
  })
  roles?: RoleEntity[];
}
