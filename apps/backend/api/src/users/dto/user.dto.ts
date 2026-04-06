import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsString,
  IsUUID,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { RoleExternalDto } from 'src/roles/dto/role-external.dto';
import {
  EMAIL_REGEX,
  NAME_REGEX,
  PASSWORD_REGEX,
  IUser,
} from '@workspace/shared';
import { toBoolean } from 'libs/utils';

export class UserDto implements IUser {
  @ApiProperty({
    type: String,
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID()
  id!: string;

  @ApiProperty({ type: String, example: 'example@mail.com' })
  @Matches(EMAIL_REGEX)
  email!: string;

  @ApiProperty({ type: String, example: '!Q1q2w3e4r' })
  @Matches(PASSWORD_REGEX)
  password!: string;

  @ApiProperty({ type: String, example: 'Linus Torvalds' })
  @Matches(NAME_REGEX)
  name!: string;

  @ApiProperty({ type: String, example: '000000000000000000000' })
  @IsString()
  googleId!: string;

  @ApiProperty({ type: Boolean, example: true })
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  enabled!: boolean;

  @ApiProperty({ type: Boolean, example: true })
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  verified!: boolean;

  @ApiProperty({ type: String, example: '1234' })
  @IsString()
  verificationCode!: string;

  @ApiProperty({ type: String, example: '1234' })
  @IsString()
  resetPasswordCode!: string;

  @ApiProperty({ type: String, example: '1234' })
  @IsString()
  changeEmailCode!: string;

  @ApiProperty({ type: String, example: '1234' })
  @IsString()
  temporaryEmail!: string;

  @ApiProperty({ type: [RoleExternalDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleExternalDto)
  roles!: RoleExternalDto[];

  @ApiProperty({ type: Date, example: new Date() })
  @IsDate()
  createdAt!: Date;

  @ApiProperty({ type: Date, example: new Date() })
  @IsDate()
  updatedAt!: Date;
}
