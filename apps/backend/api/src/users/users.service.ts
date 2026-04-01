import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  DeleteResult,
  FindOneOptions,
  FindOptionsWhere,
  ILike,
  In,
  Repository,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { UserEntity } from './user.entity';
import { CacheService } from 'src/cache/cache.service';
import { DatabaseService } from 'src/database/database.service';
import { createHash } from 'libs/utils';
import { RoleEntity } from 'src/roles/role.entity';
import { UsersRolesEntity } from 'src/database/users-roles.entity';
import {
  getField,
  IUsersRoles,
  TUserCreate,
  TUserUpdate,
  TUserReqList,
  TUserResList,
  IRole,
  IUser,
  TUserCreateGoogle,
} from '@workspace/shared';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private databaseService: DatabaseService,
    private cacheService: CacheService,
  ) {}

  async create(fields: TUserCreate, roles?: IRole[]): Promise<IUser> {
    try {
      const user = this.usersRepository.create({
        ...fields,
        password: await createHash(fields.password),
        roles,
      });
      return await this.usersRepository.save(user);
    } catch (error) {
      if (getField(error, 'code') === '23505') {
        throw new ConflictException();
      }

      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async createByGoogle(
    fields: TUserCreateGoogle,
    roles?: IRole[],
  ): Promise<IUser> {
    let user: UserEntity | null;

    try {
      user = await this.usersRepository.findOne({
        where: { googleId: fields.googleId },
        relations: { roles: { rights: { resource: true } } },
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (!user) {
      try {
        user = this.usersRepository.create({
          googleId: fields.googleId,
          name: fields.name,
          enabled: true,
          verified: true,
          roles,
        });
        await this.usersRepository.save(user);
      } catch (error) {
        Logger.error(error);
        throw new InternalServerErrorException();
      }
    }

    return user;
  }

  private async getOne(options: FindOneOptions<UserEntity>): Promise<IUser> {
    let user: UserEntity | null;

    try {
      user = await this.usersRepository.findOne(options);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  getOneAuth(email: string): Promise<IUser> {
    return this.getOne({
      where: { email },
      relations: { roles: { rights: { resource: true } } },
    });
  }

  getOneProfile(id: string): Promise<IUser> {
    return this.getOne({
      where: { id },
      relations: { roles: { rights: { resource: true } } },
    });
  }

  getOnePublic(id: string): Promise<IUser> {
    return this.getOne({
      where: { id },
      relations: { roles: true },
    });
  }

  getOneFlat(id: string): Promise<IUser> {
    return this.getOne({ where: { id } });
  }

  buildGetListOptions(fields?: TUserReqList) {
    const { options, meta } =
      this.databaseService.buildGetListOptions<UserEntity>(fields);
    options.relations = { roles: true };
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

    if (fields?.email) {
      options.where.email = ILike(`%${fields.email}%`);
      meta.filters.email = fields.email;
    }

    if (fields?.verified !== undefined) {
      options.where.verified = fields.verified;
      meta.filters.verified = fields.verified;
    }

    return { options, meta };
  }

  async getList(fields?: TUserReqList): Promise<TUserResList> {
    const { options, meta } = this.buildGetListOptions(fields);
    const result: TUserResList = { rows: [] };
    result.meta = meta;

    try {
      if (fields?.reqCount) {
        const query = await this.usersRepository.findAndCount(options);
        result.rows.push(...query[0]);
        result.meta.total = query[1];
      } else {
        result.rows.push(...(await this.usersRepository.find(options)));
      }

      return result;
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async countByRole(roleId: string): Promise<number> {
    try {
      return await this.usersRepository
        .createQueryBuilder('user')
        .innerJoin('user.roles', 'role')
        .where('role.id = :roleId', { roleId })
        .getCount();
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  private async update(
    fields: QueryDeepPartialEntity<UserEntity>,
    options: FindOptionsWhere<UserEntity>,
  ): Promise<void> {
    let result: UpdateResult;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestException();
    }

    try {
      result = await this.usersRepository.update(options, fields);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async updateFields(id: string, fields: TUserUpdate): Promise<void> {
    const user = await this.getOnePublic(id);

    if (user.roles?.some((role) => role.admin) && fields.enabled === false) {
      delete fields.enabled;
    }

    await this.update(fields, { id });
  }

  async updateVerificationCode(
    email: string,
    verificationCode: string,
  ): Promise<void> {
    await this.update({ verificationCode }, { email });
  }

  async updateVerificationStatus(
    email: string,
    verificationCode: string,
  ): Promise<void> {
    await this.update(
      { verificationCode: null, verified: true },
      { email, verificationCode },
    );
  }

  async updateResetPasswordCode(
    email: string,
    resetPasswordCode: string,
  ): Promise<void> {
    await this.update({ resetPasswordCode }, { email });
  }

  async updatePasswordWithCode(
    email: string,
    resetPasswordCode: string,
    newPassword: string,
  ): Promise<void> {
    await this.update(
      {
        resetPasswordCode: null,
        password: await createHash(newPassword),
      },
      { email, resetPasswordCode },
    );
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    await this.update({ password: await createHash(newPassword) }, { id });
  }

  async updateChangeEmailCode(
    id: string,
    changeEmailCode: string,
    newEmail: string,
  ): Promise<void> {
    await this.update({ changeEmailCode, temporaryEmail: newEmail }, { id });
  }

  async updateEmailWithCode(
    id: string,
    changeEmailCode: string,
  ): Promise<void> {
    await this.update(
      {
        email: () => `"${'temporaryEmail' satisfies keyof IUser}"`,
        changeEmailCode: null,
        temporaryEmail: null,
      },
      { id, changeEmailCode },
    );
  }

  async updateRoles(id: string, usersRoles: IUsersRoles[]): Promise<void> {
    let user: UserEntity | null;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      user = await queryRunner.manager.findOne(UserEntity, {
        where: { id },
        relations: ['roles'],
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (!user) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new NotFoundException();
    }

    let newAdminRoles: RoleEntity[];

    try {
      newAdminRoles = await queryRunner.manager.find(RoleEntity, {
        where: {
          id: In(usersRoles.map((userRole) => userRole.roleId)),
          admin: true,
        },
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    // Remove new admin roles
    const newUsersRoles = usersRoles.filter(
      (userRole) =>
        userRole.userId === id &&
        !newAdminRoles.some((role) => role.id === userRole.roleId),
    );

    // Add old admin roles
    if (user.roles) {
      newUsersRoles.push(
        ...user.roles
          .filter((role) => role.admin)
          .map(
            (role) => ({ roleId: role.id, userId: id }) satisfies IUsersRoles,
          ),
      );
    }

    try {
      await queryRunner.manager.delete(UsersRolesEntity, { userId: id });
      await queryRunner.manager.insert(UsersRolesEntity, newUsersRoles);

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
      const users = await this.usersRepository.find({
        where: { id: In(ids) },
        relations: { roles: true },
      });
      result = await this.usersRepository.delete({
        id: In(
          users
            .filter((user) => !user.roles?.some((role) => role.admin))
            .map((user) => user.id),
        ),
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (result.affected === 0) {
      throw new NotFoundException();
    }

    for (const userId of ids) {
      const keys = await this.cacheService.keys(`sessions:${userId}:*`);

      if (keys.length > 0) {
        await this.cacheService.mdel(keys);
      }
    }
  }
}
