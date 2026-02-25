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

import { RolesService } from './roles.service';
import { RoleCreateDto } from './dto/role-create.dto';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { ERights } from 'libs/constants';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleReqListDto } from './dto/role-req-list.dto';
import { RoleUpdateDto } from './dto/role-update.dto';
import { ReqItemsDto } from 'src/database/dto/req-items.dto';
import { RoleExternalDto } from './dto/role-external.dto';
import { RoleResListDto } from './dto/role-res-list.dto';
import { RightsReqItemsDto } from 'src/database/dto/rights-req-items.dto';
import { getT } from '@ap/shared/dist/locales';
import { IRole, TRoleResList } from '@ap/shared/dist/types';
import { API_ROUTES } from '@ap/shared/dist/libs';

const route = API_ROUTES.roles._;

@ApiTags(getT().roles)
@Controller(route)
export class RolesController {
  constructor(private roleService: RolesService) {}

  @ApiOperation({ summary: getT().entityCreation })
  @ApiResponse({ status: HttpStatus.CREATED, type: RoleExternalDto })
  @HttpCode(HttpStatus.CREATED)
  @Roles({ path: route, action: ERights.Creating })
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  async create(@Body() roleCreateDto: RoleCreateDto): Promise<IRole> {
    const role = await this.roleService.create(roleCreateDto);
    return plainToInstance(RoleExternalDto, role);
  }

  @ApiOperation({ summary: getT().getEntity })
  @ApiResponse({ status: HttpStatus.OK, type: RoleExternalDto })
  @HttpCode(HttpStatus.OK)
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get(API_ROUTES.roles.role(':id'))
  async getOne(@Param('id') id: string): Promise<IRole> {
    const role = await this.roleService.getOne(id);
    return plainToInstance(RoleExternalDto, role);
  }

  @ApiOperation({ summary: getT().getEntities })
  @ApiResponse({ status: HttpStatus.OK, type: RoleResListDto })
  @HttpCode(HttpStatus.OK)
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  async getList(
    @Query() roleReqListDto: RoleReqListDto,
  ): Promise<TRoleResList> {
    const roles = await this.roleService.getList(roleReqListDto);
    return plainToInstance(RoleResListDto, roles);
  }

  @ApiOperation({ summary: getT().updateEntity })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(API_ROUTES.roles.role(':id'))
  async update(
    @Param('id') id: string,
    @Body() roleUpdateDto: RoleUpdateDto,
  ): Promise<void> {
    await this.roleService.update(id, roleUpdateDto);
  }

  @ApiOperation({ summary: getT().updateEntity })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(API_ROUTES.roles.roleRights(':id'))
  async updateRights(
    @Param('id') id: string,
    @Body() rightsReqItemsDto: RightsReqItemsDto,
  ): Promise<void> {
    await this.roleService.updateRights(id, rightsReqItemsDto.items);
  }

  @ApiOperation({ summary: getT().deleteEntity })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Deleting })
  @UseGuards(JwtGuard, RolesGuard)
  @Delete()
  async delete(@Body() reqItemsDto: ReqItemsDto<IRole['id']>): Promise<void> {
    await this.roleService.delete(reqItemsDto.items);
  }
}
