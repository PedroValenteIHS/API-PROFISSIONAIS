import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AgendamentosService } from './agendamentos.service';
import { CriarAgendamentoDto } from './dto/criar-agendamento.dto';

@Controller('agendamentos')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class AgendamentosController {
  constructor(private readonly service: AgendamentosService) {}

  @Post()
  criar(@Body() dados: CriarAgendamentoDto) {
    return this.service.criar(dados);
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscarPorId(id);
  }
}
