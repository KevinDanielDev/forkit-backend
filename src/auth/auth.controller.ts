import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';

import { SignUpUserDto } from 'src/users/dto/signup-user.dto';
import { SigninUserDto } from 'src/users/dto/signin-user.dto';

import { Public } from './constants/jwt.constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signUp')
  signUp(@Body() signUpUserDto: SignUpUserDto) {
    return this.authService.signUp(signUpUserDto);
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
