import { PartialType, PickType } from '@nestjs/swagger';

import { UserDto } from './user.dto';
import { TUserUpdate } from '@workspace/shared/dist/types';

export class UserUpdateDto
  extends PartialType(PickType(UserDto, ['name', 'enabled']))
  implements TUserUpdate {}
