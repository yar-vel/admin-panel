import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { ResourcesService } from './resources.service';
import { ResourceCreateDto } from './dto/resource-create.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { ERights } from 'libs/constants';
import { Roles } from 'src/roles/roles.decorator';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ResourceReqListDto } from './dto/resource-req-list.dto';
import { ResourceUpdateDto } from './dto/resource-update.dto';
import { ReqItemsDto } from 'src/database/dto/req-items.dto';
import { ResourceExternalDto } from './dto/resource-external.dto';
import { ResourceResListDto } from './dto/resource-res-list.dto';
import { getT } from '@ap/shared/dist/locales';
import { IResource, TResourceResList } from '@ap/shared/dist/types';
import { API_ROUTES } from '@ap/shared/dist/libs';

const route = API_ROUTES.resources._;

@ApiTags(getT().resources)
@Controller(route)
export class ResourcesController {
  constructor(private resourceService: ResourcesService) {}

  @ApiOperation({ summary: getT().entityCreation })
  @ApiResponse({ status: HttpStatus.CREATED, type: ResourceExternalDto })
  @HttpCode(HttpStatus.CREATED)
  @Roles({ path: route, action: ERights.Creating })
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  async create(
    @Body() resourceCreateDto: ResourceCreateDto,
  ): Promise<IResource> {
    const resource = await this.resourceService.create(resourceCreateDto);
    return plainToInstance(ResourceExternalDto, resource);
  }

  @ApiOperation({ summary: getT().getEntity })
  @ApiResponse({ status: HttpStatus.OK, type: ResourceExternalDto })
  @HttpCode(HttpStatus.OK)
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get(API_ROUTES.resources.resource(':id'))
  async getOne(@Param('id') id: string): Promise<IResource> {
    const resource = await this.resourceService.getOne(id);
    return plainToInstance(ResourceExternalDto, resource);
  }

  @ApiOperation({ summary: getT().getEntities })
  @ApiResponse({ status: HttpStatus.OK, type: ResourceResListDto })
  @HttpCode(HttpStatus.OK)
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  async getList(
    @Query() resourceReqListDto: ResourceReqListDto,
  ): Promise<TResourceResList> {
    const resources = await this.resourceService.getList(resourceReqListDto);
    return plainToInstance(ResourceResListDto, resources);
  }

  @ApiOperation({ summary: getT().updateEntity })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(API_ROUTES.resources.resource(':id'))
  async update(
    @Param('id') id: string,
    @Body() resourceUpdateDto: ResourceUpdateDto,
  ): Promise<void> {
    await this.resourceService.update(id, resourceUpdateDto);
  }

  @ApiOperation({ summary: getT().deleteEntity })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Deleting })
  @UseGuards(JwtGuard, RolesGuard)
  @Delete()
  async delete(
    @Body() reqItemsDto: ReqItemsDto<IResource['id']>,
  ): Promise<void> {
    await this.resourceService.delete(reqItemsDto.items);
  }
}
