import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { UserDto } from './user.dto';
import { TUserCreate } from '@workspace/shared/dist/types';

export class UserCreateDto
  extends IntersectionType(
    PickType(UserDto, ['email', 'password', 'name']),
    PartialType(PickType(UserDto, ['enabled'])),
  )
  implements TUserCreate {}
