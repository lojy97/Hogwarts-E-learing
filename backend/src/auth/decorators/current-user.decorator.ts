import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
// current-user.decorator.ts


export const webuser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient();  // Access the WebSocket client
    return client.handshake.auth.user;  // Assuming the user info is available in `handshake.auth.user`
  },
);
