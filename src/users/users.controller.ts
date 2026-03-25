import { Controller, Patch, Body } from '@nestjs/common';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

import { Token } from 'src/common/decorators/token.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('update-profile')
  update(@Token() token: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(token, updateUserDto);
  }
}
