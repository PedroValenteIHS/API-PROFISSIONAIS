import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AgendamentoCriadoInterceptor } from './agendamento-criado.interceptor';
import { NotificacoesListener } from './notificacoes.listener';

@Module({
  providers: [
    NotificacoesListener,
    {
      provide: APP_INTERCEPTOR,
      useClass: AgendamentoCriadoInterceptor,
    },
  ],
})
export class NotificacoesModule {}
