import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { ESortOrder, IResList, IResListMeta, ISort } from '@workspace/shared';

class SortDto<T extends object> implements ISort<T> {
  @ApiProperty({ type: String, example: 'someField' })
  @IsString()
  field!: keyof T;

  @ApiProperty({ enum: ESortOrder, example: ESortOrder.ASC })
  @IsEnum(ESortOrder)
  order!: ESortOrder;
}

class MetaDto<T extends object> implements IResListMeta<T> {
  @ApiPropertyOptional({ type: Number, example: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ type: Number, example: 25 })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ type: Number, example: 100 })
  @IsOptional()
  @IsNumber()
  total?: number;

  @ApiPropertyOptional({ type: SortDto<T> })
  @IsOptional()
  @ValidateNested()
  @Type(() => SortDto<T>)
  sort?: SortDto<T>;

  @ApiPropertyOptional({ type: Object, example: { someField: 'someValue' } })
  @IsOptional()
  @IsObject()
  @Transform(({ value }) =>
    value && Object.keys(value as object).length > 0
      ? (value as Partial<T>)
      : undefined,
  )
  filters?: Partial<T>;
}

export class ResListDto<T extends object> implements IResList<T> {
  @ApiProperty({ type: Array, example: [{ someField: 'someValue' }] })
  @IsArray()
  rows!: T[];

  @ApiPropertyOptional({ type: MetaDto<T> })
  @IsOptional()
  @ValidateNested()
  @Type(() => MetaDto<T>)
  meta?: MetaDto<T>;
}
