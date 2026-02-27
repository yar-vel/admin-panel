import { Exclude } from 'class-transformer';

import { IRequestUser } from 'src/auth/auth.types';
import { UserExternalDto } from 'src/users/dto/user-external.dto';

export class ProfileExternalDto
  extends UserExternalDto
  implements IRequestUser
{
  @Exclude()
  sessionId: string;
}
