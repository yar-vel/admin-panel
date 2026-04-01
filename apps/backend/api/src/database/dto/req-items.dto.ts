import { ApiProperty } from '@nestjs/swagger';
import { IsArray, Validate } from 'class-validator';
import { Type } from 'class-transformer';

import { IReqItems } from '@workspace/shared';

export class ReqItemsDto<T> implements IReqItems<T> {
  @ApiProperty({
    type: Array,
    items: {
      oneOf: [{ type: 'string' }, { type: 'number' }],
    },
    example: [1, 2, 3],
  })
  @IsArray()
  @Type(() => Object)
  @Validate((value: unknown) => {
    if (!Array.isArray(value)) {
      return false;
    }

    if (value.length === 0) {
      return true;
    }

    const firstType = typeof value[0];

    if (firstType !== 'string' && firstType !== 'number') {
      return false;
    }

    return value.every((item) => typeof item === firstType);
  })
  items: T[];
}
