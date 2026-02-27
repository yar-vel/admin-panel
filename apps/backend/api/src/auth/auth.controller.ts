import {
  Controller,
  Post,
  UseGuards,
  Body,
  Res,
  Req,
  Get,
  HttpStatus,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { plainToInstance } from 'class-transformer';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtGuard } from './jwt.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { SignInDto } from './dto/sign-in.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { IFastifyRequestWithUser } from './auth.types';
import { createCookieOptions, getIP } from 'libs/utils';
import { SignInGoogleDto } from './dto/sign-in-google.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UserExternalDto } from 'src/users/dto/user-external.dto';
import { cfg } from 'config/configuration';
import { getT } from '@ap/shared/dist/locales';
import { IUser } from '@ap/shared/dist/types';
import { API_ROUTES } from '@ap/shared/dist/libs';

@ApiTags(getT().authorization)
@Controller(API_ROUTES.auth._)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: getT().signUp })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserExternalDto })
  @HttpCode(HttpStatus.CREATED)
  @Post(API_ROUTES.auth.sighUp)
  async signUp(@Body() signUpDto: SignUpDto): Promise<IUser> {
    const user = await this.authService.signUp(signUpDto);
    return plainToInstance(UserExternalDto, user);
  }

  @ApiOperation({ summary: getT().forgotPassword })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(API_ROUTES.auth.forgotPassword)
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    await this.authService.forgotPassword(forgotPasswordDto);
  }

  @ApiOperation({ summary: getT().resetPassword })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(API_ROUTES.auth.resetPassword)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    await this.authService.resetPassword(resetPasswordDto);
  }

  @ApiOperation({ summary: getT().signIn })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserExternalDto })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(LocalAuthGuard)
  @Post(API_ROUTES.auth.signIn)
  async signIn(
    @Req() req: IFastifyRequestWithUser,
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<IUser> {
    const sessionTtl = signInDto.rememberMe
      ? cfg.tokens.refresh.lifetime
      : cfg.tokens.access.lifetime * 2;
    const { accessToken, refreshToken } = await this.authService.signIn(
      req.user,
      sessionTtl,
      getIP(req),
      req.headers['user-agent'],
    );

    res.cookie('accessToken', accessToken, createCookieOptions());
    res.cookie('refreshToken', refreshToken, createCookieOptions(sessionTtl));

    if (signInDto.rememberMe) {
      res.cookie('rememberMe', 'true', createCookieOptions(sessionTtl));
    } else {
      res.clearCookie('rememberMe', createCookieOptions());
    }

    return plainToInstance(UserExternalDto, req.user);
  }

  @ApiOperation({ summary: getT().confirmRegistration })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(API_ROUTES.auth.verifyUser)
  async verifyUser(@Body() verifyUserDto: VerifyUserDto): Promise<void> {
    await this.authService.verifyUser(verifyUserDto);
  }

  @ApiOperation({ summary: getT().signUp })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserExternalDto })
  @HttpCode(HttpStatus.CREATED)
  @Post(API_ROUTES.auth.signInGoogle)
  async signInGoogle(
    @Req() req: FastifyRequest,
    @Body() signInGoogleDto: SignInGoogleDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<IUser> {
    const { accessToken, refreshToken, user } =
      await this.authService.signInGoogle(
        signInGoogleDto.googleAccessToken,
        cfg.tokens.refresh.lifetime,
        getIP(req),
        req.headers['user-agent'],
      );

    res.cookie('accessToken', accessToken, createCookieOptions());
    res.cookie(
      'refreshToken',
      refreshToken,
      createCookieOptions(cfg.tokens.refresh.lifetime),
    );
    res.cookie(
      'rememberMe',
      'true',
      createCookieOptions(cfg.tokens.refresh.lifetime),
    );

    return plainToInstance(UserExternalDto, user);
  }

  @ApiOperation({ summary: getT().refreshToken })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtRefreshGuard)
  @Get(API_ROUTES.auth.refresh)
  async refresh(
    @Req() req: IFastifyRequestWithUser,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<void> {
    const rememberMe = req.cookies['rememberMe'] !== undefined;
    const sessionTtl = rememberMe
      ? cfg.tokens.refresh.lifetime
      : cfg.tokens.access.lifetime * 2;
    const { accessToken, refreshToken } = await this.authService.refresh(
      req.user,
      sessionTtl,
      getIP(req),
      req.headers['user-agent'],
    );

    res.cookie('accessToken', accessToken, createCookieOptions());
    res.cookie('refreshToken', refreshToken, createCookieOptions(sessionTtl));

    if (rememberMe) {
      res.cookie('rememberMe', 'true', createCookieOptions(sessionTtl));
    }
  }

  @ApiOperation({ summary: getT().signOut })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtGuard)
  @Delete(API_ROUTES.auth.signOut)
  async signOut(
    @Req() req: IFastifyRequestWithUser,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<void> {
    await this.authService.signOut(req.user);
    const cookieOptions = createCookieOptions();

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    res.clearCookie('rememberMe', cookieOptions);
  }
}
