import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { ISignInGoogle } from '@workspace/shared';

export class SignInGoogleDto implements ISignInGoogle {
  @ApiProperty({ type: String, example: 'googleAccessToken' })
  @IsString()
  googleAccessToken: string;
}
