import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { UserDto } from './user.dto';
import { IUser } from '@workspace/shared/dist/types';

export class UserExternalDto
  extends IntersectionType(
    PickType(UserDto, [
      'id',
      'name',
      'enabled',
      'verified',
      'createdAt',
      'updatedAt',
    ]),
    PartialType(PickType(UserDto, ['email', 'googleId', 'roles'])),
  )
  implements IUser
{
  @Exclude()
  password?: string | null | undefined;

  @Exclude()
  verificationCode?: string | null | undefined;

  @Exclude()
  resetPasswordCode?: string | null | undefined;

  @Exclude()
  changeEmailCode?: string | null | undefined;

  @Exclude()
  temporaryEmail?: string | null | undefined;
}
