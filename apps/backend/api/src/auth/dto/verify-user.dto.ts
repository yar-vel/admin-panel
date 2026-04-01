import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { IVerifyUser } from '@workspace/shared';

export class VerifyUserDto implements IVerifyUser {
  @ApiProperty({ type: String, example: 'example@mail.com' })
  @IsString()
  email: string;

  @ApiProperty({ type: String, example: '1234' })
  @IsString()
  code: string;
}
