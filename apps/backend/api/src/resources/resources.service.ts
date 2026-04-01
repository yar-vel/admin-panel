import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, ILike, In, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ResourceEntity } from './resource.entity';
import { DatabaseService } from 'src/database/database.service';
import {
  getField,
  TResourceCreate,
  TResourceUpdate,
  TResourceReqList,
  TResourceResList,
  IResource,
} from '@workspace/shared';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(ResourceEntity)
    private resourcesRepository: Repository<ResourceEntity>,
    private databaseService: DatabaseService,
  ) {}

  async create(fields: TResourceCreate): Promise<IResource> {
    try {
      const resource = this.resourcesRepository.create(fields);
      return await this.resourcesRepository.save(resource);
    } catch (error) {
      if (getField(error, 'code') === '23505') {
        throw new ConflictException();
      }

      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async createManyDefault(fieldsArr: TResourceCreate[]): Promise<IResource[]> {
    try {
      const resources = fieldsArr.map((fields) =>
        this.resourcesRepository.create({ ...fields, default: true }),
      );
      return await this.resourcesRepository.save(resources);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getOne(id: string): Promise<IResource> {
    let resource: ResourceEntity | null;

    try {
      resource = await this.resourcesRepository.findOne({ where: { id } });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (!resource) {
      throw new NotFoundException();
    }

    return resource;
  }

  buildGetListOptions(fields?: TResourceReqList) {
    const { options, meta } =
      this.databaseService.buildGetListOptions<ResourceEntity>(fields);
    options.where = {};
    meta.filters = {};

    if (fields?.name) {
      options.where.name = ILike(`%${fields.name}%`);
      meta.filters.name = fields.name;
    }

    if (fields?.path) {
      options.where.path = ILike(`%${fields.path}%`);
      meta.filters.path = fields.path;
    }

    if (fields?.enabled !== undefined) {
      options.where.enabled = fields.enabled;
      meta.filters.enabled = fields.enabled;
    }

    if (fields?.default !== undefined) {
      options.where.default = fields.default;
      meta.filters.default = fields.default;
    }

    return { options, meta };
  }

  async getList(fields?: TResourceReqList): Promise<TResourceResList> {
    const { options, meta } = this.buildGetListOptions(fields);
    const result: TResourceResList = { rows: [] };
    result.meta = meta;

    try {
      if (fields?.reqCount) {
        const query = await this.resourcesRepository.findAndCount(options);
        result.rows.push(...query[0]);
        result.meta.total = query[1];
      } else {
        result.rows.push(...(await this.resourcesRepository.find(options)));
      }

      return result;
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, fields: TResourceUpdate): Promise<void> {
    let result: UpdateResult;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestException();
    }

    try {
      result = await this.resourcesRepository.update(
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
  }

  async delete(ids: string[]): Promise<void> {
    let result: DeleteResult;

    try {
      result = await this.resourcesRepository.delete({
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
