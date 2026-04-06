import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

import { IRole, IUser, IUsersRoles } from '@workspace/shared';

export class UsersRolesDto implements IUsersRoles {
  @ApiProperty({
    type: String,
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID()
  userId!: IUser['id'];

  @ApiProperty({
    type: String,
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID()
  roleId!: IRole['id'];
}
