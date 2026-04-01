import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { ReqListDto } from 'src/database/dto/req-list.dto';
import { RoleDto } from './role.dto';
import { TRoleReqList } from '@workspace/shared';

export class RoleReqListDto
  extends IntersectionType(
    ReqListDto<RoleDto>,
    PartialType(PickType(RoleDto, ['name', 'enabled', 'default', 'admin'])),
  )
  implements TRoleReqList {}
