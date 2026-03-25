import {
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { ReqListDto } from 'src/database/dto/req-list.dto';
import { UserDto } from './user.dto';
import { TUserReqList } from '@workspace/shared/dist/types';

export class UserReqListDto
  extends IntersectionType(
    ReqListDto<UserDto>,
    PartialType(PickType(UserDto, ['name', 'enabled', 'email', 'verified'])),
  )
  implements TUserReqList
{
  @ApiPropertyOptional({ type: String, example: 'example@mail.com' })
  @IsOptional()
  @IsString()
  email?: string;
}
