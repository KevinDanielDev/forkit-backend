import { Controller, Patch, Body } from '@nestjs/common';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

import { Token } from 'src/common/decorators/token.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';

import { ERoles } from 'src/common/models/enums/roles.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('update-profile')
  @Roles([ERoles.ADMIN])
  update(@Token() token: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(token, updateUserDto);
  }
}
