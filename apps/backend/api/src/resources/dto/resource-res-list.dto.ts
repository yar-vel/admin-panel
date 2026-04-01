import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { ResListDto } from 'src/database/dto/res-list.dto';
import { ResourceExternalDto } from './resource-external.dto';
import { TResourceResList } from '@workspace/shared';

export class ResourceResListDto
  extends ResListDto<ResourceExternalDto>
  implements TResourceResList
{
  @ApiProperty({ type: [ResourceExternalDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResourceExternalDto)
  declare rows: ResourceExternalDto[];
}
