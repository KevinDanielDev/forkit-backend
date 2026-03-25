import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();

    const bearerToken = req.headers['authorization'] as string;
    const token = bearerToken.split(' ')[1];
    return token;
  },
);
