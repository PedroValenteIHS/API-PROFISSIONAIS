import {
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { StatusAgendamento } from '@prisma/client';
import { AgendamentosService } from './agendamentos.service';

@Controller('pacientes')
export class PacientesAgendamentosController {
  constructor(private readonly service: AgendamentosService) {}

  @Get(':id/agendamentos')
  listar(
    @Param('id', ParseIntPipe) id: number,
    @Query('status', new ParseEnumPipe(StatusAgendamento, { optional: true }))
    status?: StatusAgendamento,
  ) {
    return this.service.listarPorPaciente(id, status);
  }
}
