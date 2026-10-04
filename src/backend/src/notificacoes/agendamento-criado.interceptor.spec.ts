import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import {
  AGENDAMENTO_CRIADO_EVENTO,
  AgendamentoCriadoInterceptor,
} from './agendamento-criado.interceptor';

function createContext(method: string, url: string): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ method, url }),
    }),
  } as unknown as ExecutionContext;
}

function createCallHandler(response: unknown): CallHandler {
  return { handle: () => of(response) };
}

describe('AgendamentoCriadoInterceptor', () => {
  it('emite o evento quando a rota é POST /api/v1/agendamentos', (done) => {
    const eventEmitter = { emit: jest.fn() };
    const interceptor = new AgendamentoCriadoInterceptor(
      eventEmitter as any,
    );
    const agendamento = { id: 1088 };

    interceptor
      .intercept(
        createContext('POST', '/api/v1/agendamentos'),
        createCallHandler(agendamento),
      )
      .subscribe(() => {
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          AGENDAMENTO_CRIADO_EVENTO,
          agendamento,
        );
        done();
      });
  });

  it('não emite o evento para outras rotas', (done) => {
    const eventEmitter = { emit: jest.fn() };
    const interceptor = new AgendamentoCriadoInterceptor(
      eventEmitter as any,
    );

    interceptor
      .intercept(
        createContext('GET', '/api/v1/pacientes'),
        createCallHandler([]),
      )
      .subscribe(() => {
        expect(eventEmitter.emit).not.toHaveBeenCalled();
        done();
      });
  });
});
