import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { User } from '../user.entity';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor<any, any> {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<{
      session?: { userId?: number };
      currentUser?: User;
    }>();

    if (request.session?.userId) {
      const user = await this.usersService.findOne(request.session.userId);
      request.currentUser = user;
    }

    return next.handle();
  }
}
