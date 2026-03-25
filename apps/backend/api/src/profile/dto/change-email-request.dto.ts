import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

import { EMAIL_REGEX } from '@workspace/shared/dist/libs';
import { IChangeEmailRequest } from '@workspace/shared/dist/types';

export class ChangeEmailRequestDto implements IChangeEmailRequest {
  @ApiProperty({ type: String, example: 'example@mail.com' })
  @Matches(EMAIL_REGEX)
  newEmail: string;
}
