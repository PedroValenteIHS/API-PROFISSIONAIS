import { Module } from '@nestjs/common';
import { AgendamentosController } from './agendamentos.controller';
import { AgendamentosService } from './agendamentos.service';
import { PacientesAgendamentosController } from './pacientes-agendamentos.controller';

@Module({
  controllers: [AgendamentosController, PacientesAgendamentosController],
  providers: [AgendamentosService],
})
export class AgendamentosModule {}
