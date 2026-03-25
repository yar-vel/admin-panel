import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { ReqListDto } from 'src/database/dto/req-list.dto';
import { ResourceDto } from './resource.dto';
import { TResourceReqList } from '@workspace/shared/dist/types';

export class ResourceReqListDto
  extends IntersectionType(
    ReqListDto<ResourceDto>,
    PartialType(PickType(ResourceDto, ['name', 'path', 'enabled', 'default'])),
  )
  implements TResourceReqList {}
