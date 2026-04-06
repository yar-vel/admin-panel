import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { ISignIn } from '@workspace/shared';

export class SignInDto implements ISignIn {
  @ApiProperty({ type: String, example: 'example@mail.com' })
  @IsString()
  username!: string;

  @ApiProperty({ type: String, example: '!Q1q2w3e4r' })
  @IsString()
  password!: string;

  @ApiPropertyOptional({ type: Boolean, example: true })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
