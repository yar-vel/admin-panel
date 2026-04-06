import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Matches } from 'class-validator';

import {
  EMAIL_REGEX,
  NAME_REGEX,
  PASSWORD_REGEX,
  TSignUp,
} from '@workspace/shared';

export class SignUpDto implements TSignUp {
  @ApiProperty({ type: String, example: 'example@mail.com' })
  @Matches(EMAIL_REGEX)
  email!: string;

  @ApiProperty({ type: String, example: '!Q1q2w3e4r' })
  @Matches(PASSWORD_REGEX)
  password!: string;

  @ApiProperty({ type: String, example: 'Linus Torvalds' })
  @Matches(NAME_REGEX)
  @Transform(({ value }) => (value as string).trim())
  name!: string;
}
