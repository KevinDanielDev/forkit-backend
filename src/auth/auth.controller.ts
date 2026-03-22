import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';

import { CreateUserDto } from 'src/users/dto/signup-user.dto';
import { SigninUserDto } from 'src/users/dto/signin-user.dto';

import { Public } from './constants/jwt.constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signUp')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Public()
  @Post('signIn')
  signIn(@Body() signinUserDto: SigninUserDto) {
    return this.authService.signIn(signinUserDto);
  }

  @Public()
  @Post('refreshAccessToken')
  refreshAccessToken(@Body() refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }

  @Post('logOut')
  logOut(@Body() term: string) {
    return this.authService.logOut(term);
  }
}
