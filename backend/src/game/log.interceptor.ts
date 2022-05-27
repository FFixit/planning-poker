import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const method = context.getHandler().name;
        const socket = context.getArgByIndex(0);
        const payload = context.getArgByIndex(1);

        const rooms = Array.from(socket.rooms || []);
        console.log(method, rooms);
        return next.handle();
    }
}
