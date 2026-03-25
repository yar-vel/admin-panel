import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { ResListDto } from 'src/database/dto/res-list.dto';
import { RoleExternalDto } from './role-external.dto';
import { TRoleResList } from '@workspace/shared/dist/types';

export class RoleResListDto
  extends ResListDto<RoleExternalDto>
  implements TRoleResList
{
  @ApiProperty({ type: [RoleExternalDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleExternalDto)
  declare rows: RoleExternalDto[];
}
