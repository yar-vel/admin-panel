import { PartialType, PickType } from '@nestjs/swagger';

import { UserDto } from 'src/users/dto/user.dto';
import { TUserUpdate } from '@workspace/shared';

export class ProfileUpdateDto
  extends PartialType(PickType(UserDto, ['name']))
  implements TUserUpdate {}
