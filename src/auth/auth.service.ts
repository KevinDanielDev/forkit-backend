import { Injectable } from '@nestjs/common';

import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  signup(createUserDto: CreateUserDto) {
    return {
      message: 'User created successfully',
      data: createUserDto,
    };
  }
}
