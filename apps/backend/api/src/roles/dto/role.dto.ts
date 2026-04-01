import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsUUID,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { RightsDto } from 'src/database/dto/rights.dto';
import { IRole } from '@workspace/shared';
import { toBoolean } from 'libs/utils';

export class RoleDto implements IRole {
  @ApiProperty({
    type: String,
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String, example: 'Member' })
  @Length(1, 100)
  name: string;

  @ApiProperty({ type: String, example: 'Lorem ipsum' })
  @MaxLength(1000)
  description: string;

  @ApiProperty({ type: Boolean, example: true })
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ type: Boolean, example: false })
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  admin: boolean;

  @ApiProperty({ type: Boolean, example: false })
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  default: boolean;

  @ApiProperty({ type: () => [RightsDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RightsDto)
  rights: RightsDto[];

  @ApiProperty({ type: Date, example: new Date() })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ type: Date, example: new Date() })
  @IsDate()
  updatedAt: Date;
}
