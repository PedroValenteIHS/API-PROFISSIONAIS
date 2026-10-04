import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AGENDAMENTO_CRIADO_EVENTO } from './agendamento-criado.interceptor';

@Injectable()
export class NotificacoesListener {
  private readonly logger = new Logger(NotificacoesListener.name);

  @OnEvent(AGENDAMENTO_CRIADO_EVENTO)
  enviarConfirmacao(agendamento: { id: number }): void {
    this.logger.log(
      `Notificação de confirmação enviada para o agendamento #${agendamento.id} (simulado — sem provedor de e-mail/SMS configurado)`,
    );
  }
}
