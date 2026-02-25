import {
  Controller,
  UseGuards,
  Body,
  Req,
  Get,
  HttpStatus,
  Delete,
  Patch,
  Post,
  HttpCode,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { ProfileUpdateDto } from './dto/profile-update.dto';
import { Roles } from 'src/roles/roles.decorator';
import { ERights } from 'libs/constants';
import { RolesGuard } from 'src/roles/roles.guard';
import { TFastifyRequestWithToken } from 'src/auth/auth.types';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ProfileService } from './profile.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ChangeEmailRequestDto } from './dto/change-email-request.dto';
import { ChangeEmailConfirmDto } from './dto/change-email-confirm.dto';
import { ReqItemsDto } from 'src/database/dto/req-items.dto';
import { UserExternalDto } from 'src/users/dto/user-external.dto';
import { SessionExternalDto } from './dto/session-external.dto';
import { getT } from '@ap/shared/dist/locales';
import { IUser, TSessionExternal } from '@ap/shared/dist/types';
import { API_ROUTES } from '@ap/shared/dist/libs';

const route = API_ROUTES.profile._;

@ApiTags(getT().profile)
@Controller(route)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @ApiOperation({ summary: getT().getProfileFields })
  @ApiResponse({ status: HttpStatus.OK, type: UserExternalDto })
  @HttpCode(HttpStatus.OK)
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  getProfile(@Req() req: TFastifyRequestWithToken): IUser {
    return plainToInstance(UserExternalDto, req.originalUser);
  }

  @ApiOperation({ summary: getT().updateProfile })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch()
  async updateProfile(
    @Req() req: TFastifyRequestWithToken,
    @Body() profileUpdateDto: ProfileUpdateDto,
  ): Promise<void> {
    await this.profileService.updateProfile(req.user.userId, profileUpdateDto);
  }

  @ApiOperation({ summary: getT().updatePassword })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(API_ROUTES.profile.updatePassword)
  async updatePassword(
    @Req() req: TFastifyRequestWithToken,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    await this.profileService.updatePassword(
      req.user.userId,
      updatePasswordDto,
    );
  }

  @ApiOperation({ summary: getT().changeEmailRequest })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Post(API_ROUTES.profile.changeEmail)
  async changeEmailRequest(
    @Req() req: TFastifyRequestWithToken,
    @Body() dhangeEmailRequestDto: ChangeEmailRequestDto,
  ): Promise<void> {
    await this.profileService.changeEmailRequest(
      req.user.userId,
      dhangeEmailRequestDto,
    );
  }

  @ApiOperation({ summary: getT().changeEmailConfirm })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(API_ROUTES.profile.changeEmail)
  async changeEmailConfirm(
    @Req() req: TFastifyRequestWithToken,
    @Body() changeEmailConfirmDto: ChangeEmailConfirmDto,
  ): Promise<void> {
    await this.profileService.changeEmailConfirm(
      req.user.userId,
      changeEmailConfirmDto,
    );
  }

  @ApiOperation({ summary: getT().getSessions })
  @ApiResponse({ status: HttpStatus.OK, type: [SessionExternalDto] })
  @HttpCode(HttpStatus.OK)
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get(API_ROUTES.profile.sessions)
  async getSessions(
    @Req() req: TFastifyRequestWithToken,
  ): Promise<TSessionExternal[]> {
    const sessions = await this.profileService.getSessions(
      req.user.userId,
      req.user.sessionId,
    );
    return plainToInstance(SessionExternalDto, sessions);
  }

  @ApiOperation({ summary: getT().deleteSessions })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Deleting })
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(API_ROUTES.profile.sessions)
  async deleteSessions(
    @Req() req: TFastifyRequestWithToken,
    @Body() reqItemsDto: ReqItemsDto<TSessionExternal['id']>,
  ): Promise<void> {
    await this.profileService.deleteSessions(
      req.user.userId,
      reqItemsDto.items,
    );
  }
}
