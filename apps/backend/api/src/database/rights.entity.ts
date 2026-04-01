import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RoleEntity } from 'src/roles/role.entity';
import { ResourceEntity } from 'src/resources/resource.entity';
import { IResource, IRights, IRole } from '@workspace/shared';

@Entity('rights')
export class RightsEntity implements IRights {
  @PrimaryColumn('uuid')
  roleId: IRole['id'];

  @ManyToOne(() => RoleEntity, (role) => role.rights, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role?: RoleEntity;

  @PrimaryColumn('uuid')
  resourceId: IResource['id'];

  @ManyToOne(() => ResourceEntity, (resource) => resource.rights, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'resourceId' })
  resource?: ResourceEntity;

  @Column({ type: 'boolean', default: false })
  creating: boolean;

  @Column({ type: 'boolean', default: false })
  reading: boolean;

  @Column({ type: 'boolean', default: false })
  updating: boolean;

  @Column({ type: 'boolean', default: false })
  deleting: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt?: Date;
}
