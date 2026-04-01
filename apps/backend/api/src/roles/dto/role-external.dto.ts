import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { RoleDto } from './role.dto';
import { IRole } from '@workspace/shared';

export class RoleExternalDto
  extends IntersectionType(
    PickType(RoleDto, [
      'id',
      'name',
      'enabled',
      'admin',
      'default',
      'createdAt',
      'updatedAt',
    ]),
    PartialType(PickType(RoleDto, ['description', 'rights'])),
  )
  implements IRole {}
