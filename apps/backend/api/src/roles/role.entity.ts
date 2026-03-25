import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from '../users/user.entity';
import { RightsEntity } from 'src/database/rights.entity';
import { IRole } from '@workspace/shared/dist/types';
import { EmptyStringToNull } from 'src/database/database.utils';

@Entity('roles')
export class RoleEntity implements IRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({
    type: 'varchar',
    length: 1000,
    nullable: true,
    transformer: EmptyStringToNull,
  })
  description?: string | null;

  @Column({ type: 'boolean', default: false })
  enabled: boolean;

  @Column({ type: 'boolean', default: false })
  admin: boolean;

  @Column({ type: 'boolean', default: false })
  default: boolean;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users?: UserEntity[];

  @OneToMany(() => RightsEntity, (rights) => rights.role)
  rights?: RightsEntity[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt?: Date;
}
