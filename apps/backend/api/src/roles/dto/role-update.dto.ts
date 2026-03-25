import { PartialType, PickType } from '@nestjs/swagger';

import { RoleDto } from './role.dto';
import { TRoleUpdate } from '@workspace/shared/dist/types';

export class RoleUpdateDto
  extends PartialType(PickType(RoleDto, ['name', 'description', 'enabled']))
  implements TRoleUpdate {}
