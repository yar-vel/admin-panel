import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  DataSource,
  DeleteResult,
  ILike,
  In,
  Repository,
  UpdateResult,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { RoleEntity } from './role.entity';
import { RightsEntity } from '../database/rights.entity';
import { DatabaseService } from 'src/database/database.service';
import {
  IResList,
  IRights,
  TRoleCreate,
  TRoleUpdate,
  TRoleReqList,
  TRoleResList,
  IRole,
} from '@workspace/shared/dist/types';
import { getField } from '@workspace/shared/dist/libs';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private rolesRepository: Repository<RoleEntity>,
    private dataSource: DataSource,
    private databaseService: DatabaseService,
  ) {}

  async create(fields: TRoleCreate): Promise<IRole> {
    try {
      const role = this.rolesRepository.create(fields);
      return await this.rolesRepository.save(role);
    } catch (error) {
      if (getField(error, 'code') === '23505') {
        throw new ConflictException();
      }

      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findOrCreateDefault(
    fields: Partial<Pick<IRole, 'name' | 'description' | 'admin'>>,
  ): Promise<IRole> {
    let role: RoleEntity | null;

    try {
      role = await this.rolesRepository.findOne({
        where: {
          name: fields.name,
          default: true,
          admin: fields.admin ?? false,
        },
        relations: { rights: { resource: true } },
      });

      if (!role) {
        role = this.rolesRepository.create({
          name: fields.name,
          description: fields.description,
          default: true,
          admin: fields.admin ?? false,
          enabled: true,
        });
        await this.rolesRepository.save(role);
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    return role;
  }

  async getOne(id: string): Promise<IRole> {
    let role: RoleEntity | null;

    try {
      role = await this.rolesRepository.findOne({
        where: { id },
        relations: { rights: { resource: true } },
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (!role) {
      throw new NotFoundException();
    }

    return role;
  }

  buildGetListOptions(fields?: TRoleReqList) {
    const { options, meta } =
      this.databaseService.buildGetListOptions<RoleEntity>(fields);
    options.where = {};
    meta.filters = {};

    if (fields?.name) {
      options.where.name = ILike(`%${fields.name}%`);
      meta.filters.name = fields.name;
    }

    if (fields?.enabled !== undefined) {
      options.where.enabled = fields.enabled;
      meta.filters.enabled = fields.enabled;
    }

    if (fields?.default !== undefined) {
      options.where.default = fields.default;
      meta.filters.default = fields.default;
    }

    if (fields?.admin !== undefined) {
      options.where.admin = fields.admin;
      meta.filters.admin = fields.admin;
    }

    return { options, meta };
  }

  async getList(fields?: TRoleReqList): Promise<IResList<IRole>> {
    const { options, meta } = this.buildGetListOptions(fields);
    const result: TRoleResList = { rows: [] };
    result.meta = meta;

    try {
      if (fields?.reqCount) {
        const query = await this.rolesRepository.findAndCount(options);
        result.rows.push(...query[0]);
        result.meta.total = query[1];
      } else {
        result.rows.push(...(await this.rolesRepository.find(options)));
      }

      return result;
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, fields: TRoleUpdate): Promise<boolean> {
    let result: UpdateResult;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestException();
    }

    try {
      result = await this.rolesRepository.update(
        { id, default: false },
        fields,
      );
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (result.affected === 0) {
      throw new NotFoundException();
    }

    return true;
  }

  async updateRights(
    id: string,
    rights: IRights[],
    defaultResource?: boolean,
  ): Promise<void> {
    let role: RoleEntity | null;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      role = await queryRunner.manager.findOne(RoleEntity, {
        where: { id, default: defaultResource ?? false },
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (!role) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new NotFoundException();
    }

    try {
      await queryRunner.manager.delete(RightsEntity, { roleId: id });
      await queryRunner.manager.insert(
        RightsEntity,
        rights
          .filter((value) => value.roleId === id)
          .map((value) => ({ ...value, roleId: id })),
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      Logger.error(error);
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async delete(ids: string[]): Promise<void> {
    let result: DeleteResult;

    try {
      result = await this.rolesRepository.delete({
        id: In(ids),
        default: false,
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
}
