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

import { UserCreateDto } from './dto/user-create.dto';
import { UsersService } from './users.service';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { ERights } from 'libs/constants';
import { JwtGuard } from 'src/auth/jwt.guard';
import { UserReqListDto } from './dto/user-req-list.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { ReqItemsDto } from 'src/database/dto/req-items.dto';
import { UserExternalDto } from './dto/user-external.dto';
import { UserResListDto } from './dto/user-res-list.dto';
import { UsersRolesReqItemsDto } from 'src/database/dto/users-roles-req-items.dto';
import { getT } from '@ap/shared/dist/locales';
import { IResList, IUser } from '@ap/shared/dist/types';
import { API_ROUTES } from '@ap/shared/dist/libs';

const route = API_ROUTES.users._;

@ApiTags(getT().users)
@Controller(route)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: getT().entityCreation })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserExternalDto })
  @HttpCode(HttpStatus.CREATED)
  @Roles({ path: route, action: ERights.Creating })
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  async create(@Body() userCreateDto: UserCreateDto): Promise<IUser> {
    const user = await this.usersService.create(userCreateDto);
    return plainToInstance(UserExternalDto, user);
  }

  @ApiOperation({ summary: getT().getEntity })
  @ApiResponse({ status: HttpStatus.OK, type: UserExternalDto })
  @HttpCode(HttpStatus.OK)
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get(API_ROUTES.users.user(':id'))
  async getOne(@Param('id') id: string): Promise<IUser> {
    const user = await this.usersService.getOnePublic(id);
    return plainToInstance(UserExternalDto, user);
  }

  @ApiOperation({ summary: getT().getEntities })
  @ApiResponse({ status: HttpStatus.OK, type: UserResListDto })
  @HttpCode(HttpStatus.OK)
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  async getList(
    @Query() userReqListDto: UserReqListDto,
  ): Promise<IResList<IUser>> {
    const users = await this.usersService.getList(userReqListDto);
    return plainToInstance(UserResListDto, users);
  }

  @ApiOperation({ summary: getT().updateEntity })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(API_ROUTES.users.user(':id'))
  async update(
    @Param('id') id: string,
    @Body() userUpdateDto: UserUpdateDto,
  ): Promise<void> {
    await this.usersService.updateFields(id, userUpdateDto);
  }

  @ApiOperation({ summary: getT().updateEntity })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(API_ROUTES.users.userRoles(':id'))
  async updateRoles(
    @Param('id') id: string,
    @Body() usersRolesReqItemsDto: UsersRolesReqItemsDto,
  ): Promise<void> {
    await this.usersService.updateRoles(id, usersRolesReqItemsDto.items);
  }

  @ApiOperation({ summary: getT().deleteEntity })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Deleting })
  @UseGuards(JwtGuard, RolesGuard)
  @Delete()
  async delete(@Body() queryItemsDto: ReqItemsDto<IUser['id']>): Promise<void> {
    await this.usersService.delete(queryItemsDto.items);
  }
}
