import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from 'src/users/users.service';

import { IPayload } from '../interfaces/payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: IPayload) {
    const user = await this.usersService.findByTerm(payload.email);

    if (!user) throw new UnauthorizedException('Invalid token');
    if (!user.isActive) throw new UnauthorizedException('User is not active');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, password, ...restUser } = user;

    return restUser;
  }
}
