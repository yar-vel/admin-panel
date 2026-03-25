import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { ResourceDto } from './resource.dto';
import { IResource } from '@workspace/shared/dist/types';

export class ResourceExternalDto
  extends IntersectionType(
    PickType(ResourceDto, [
      'id',
      'name',
      'path',
      'enabled',
      'default',
      'createdAt',
      'updatedAt',
    ]),
    PartialType(PickType(ResourceDto, ['description'])),
  )
  implements IResource {}
