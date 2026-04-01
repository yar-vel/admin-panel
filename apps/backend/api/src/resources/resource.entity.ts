import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RightsEntity } from 'src/database/rights.entity';
import { IResource } from '@workspace/shared';
import { EmptyStringToNull } from 'src/database/database.utils';

@Entity('resources')
export class ResourceEntity implements IResource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  path: string;

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
  default: boolean;

  @OneToMany(() => RightsEntity, (right) => right.resource)
  rights?: RightsEntity[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt?: Date;
}
