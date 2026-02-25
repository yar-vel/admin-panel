import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsUUID,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { RightsDto } from 'src/database/dto/rights.dto';
import { IResource } from '@ap/shared/dist/types';
import { toBoolean } from 'libs/utils';

export class ResourceDto implements IResource {
  @ApiProperty({
    type: String,
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String, example: 'Posts' })
  @Length(1, 100)
  name: string;

  @ApiProperty({ type: String, example: 'posts' })
  @Length(1, 100)
  path: string;

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
  default: boolean;

  @ApiProperty({ type: () => [RightsDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RightsDto)
  rights: RightsDto[];
}
