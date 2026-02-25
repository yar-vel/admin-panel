import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { RoleDto } from 'src/roles/dto/role.dto';
import { ResourceDto } from 'src/resources/dto/resource.dto';
import { IResource, IRights, IRole } from '@ap/shared/dist/types';

export class RightsDto implements IRights {
  @ApiProperty({
    type: String,
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID()
  roleId: IRole['id'];

  @ApiPropertyOptional({ type: () => RoleDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => RoleDto)
  role?: RoleDto;

  @ApiProperty({
    type: String,
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID()
  resourceId: IResource['id'];

  @ApiPropertyOptional({ type: () => ResourceDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ResourceDto)
  resource?: ResourceDto;

  @ApiProperty({ type: Boolean, example: false })
  @IsBoolean()
  creating: boolean;

  @ApiProperty({ type: Boolean, example: false })
  @IsBoolean()
  reading: boolean;

  @ApiProperty({ type: Boolean, example: false })
  @IsBoolean()
  updating: boolean;

  @ApiProperty({ type: Boolean, example: false })
  @IsBoolean()
  deleting: boolean;
}
