import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StatusAgendamento } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CriarAgendamentoDto } from './dto/criar-agendamento.dto';

@Injectable()
export class AgendamentosService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dados: CriarAgendamentoDto) {
    const dataHora = new Date(dados.dataHora);

    const paciente = await this.prisma.paciente.findUnique({
      where: { id: dados.pacienteId },
    });
    if (!paciente) {
      throw new NotFoundException({
        erro: 'paciente_nao_encontrado',
        mensagem: 'Paciente não encontrado.',
      });
    }

    const profissional = await this.prisma.profissional.findUnique({
      where: { id: dados.profissionalId },
    });
    if (!profissional) {
      throw new NotFoundException({
        erro: 'profissional_nao_encontrado',
        mensagem: 'Profissional não encontrado.',
      });
    }

    const ocupado = await this.prisma.agendamento.findFirst({
      where: {
        profissionalId: dados.profissionalId,
        dataHora,
        status: StatusAgendamento.AGENDADO,
      },
    });
    if (ocupado) {
      throw new ConflictException({
        erro: 'horario_indisponivel',
        mensagem: 'Este horário foi ocupado. Escolha outro.',
      });
    }

    const agendamento = await this.prisma.agendamento.create({
      data: {
        pacienteId: dados.pacienteId,
        profissionalId: dados.profissionalId,
        dataHora,
      },
    });

    return this.buscarPorId(agendamento.id);
  }

  async buscarPorId(id: number) {
    const agendamento = await this.prisma.agendamento.findUnique({
      where: { id },
      include: {
        profissional: { include: { usuario: true, especialidade: true } },
      },
    });
    if (!agendamento) {
      throw new NotFoundException({
        erro: 'nao_encontrado',
        mensagem: 'Agendamento não encontrado.',
      });
    }

    return {
      id: agendamento.id,
      status: agendamento.status,
      dataHora: agendamento.dataHora,
      pacienteId: agendamento.pacienteId,
      profissional: {
        id: agendamento.profissional.id,
        nome: agendamento.profissional.usuario.nome,
      },
      especialidade: agendamento.profissional.especialidade.nome,
      criadoEm: agendamento.criadoEm,
      canceladoEm: agendamento.canceladoEm,
    };
  }

  async listarPorPaciente(pacienteId: number, status?: StatusAgendamento) {
    const lista = await this.prisma.agendamento.findMany({
      where: { pacienteId, status },
      include: {
        profissional: { include: { usuario: true, especialidade: true } },
      },
      orderBy: { dataHora: 'asc' },
    });

    return {
      pacienteId,
      total: lista.length,
      agendamentos: lista.map((a) => ({
        id: a.id,
        dataHora: a.dataHora,
        profissional: a.profissional.usuario.nome,
        especialidade: a.profissional.especialidade.nome,
        status: a.status,
      })),
    };
  }
}
