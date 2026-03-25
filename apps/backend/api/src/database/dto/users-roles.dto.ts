import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsUUID } from 'class-validator';

import { IRole, IUser, IUsersRoles } from '@workspace/shared/dist/types';

export class UsersRolesDto implements IUsersRoles {
  @ApiProperty({
    type: String,
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID()
  userId: IUser['id'];

  @ApiProperty({
    type: String,
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID()
  roleId: IRole['id'];

  @ApiProperty({ type: Date, example: new Date() })
  @IsDate()
  createdAt: Date;
}
