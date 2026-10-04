import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

export const AGENDAMENTO_CRIADO_EVENTO = 'agendamento.criado';

// Publica o evento de criação de agendamento sem alterar o controller/service de Agendamentos (RNF-206).
@Injectable()
export class AgendamentoCriadoInterceptor implements NestInterceptor {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const isCriacaoDeAgendamento =
      request.method === 'POST' && request.url === '/api/v1/agendamentos';

    return next.handle().pipe(
      tap((agendamento) => {
        if (isCriacaoDeAgendamento) {
          this.eventEmitter.emit(AGENDAMENTO_CRIADO_EVENTO, agendamento);
        }
      }),
    );
  }
}
