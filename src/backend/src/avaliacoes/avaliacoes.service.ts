import {
  BadRequestException, ConflictException, ForbiddenException,
  Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PerfilUsuario, Prisma, StatusAgendamento } from '@prisma/client';
import { JwtPayload } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { CriarAvaliacaoDto } from './dto/criar-avaliacao.dto';
import { AtualizarAvaliacaoDto } from './dto/atualizar-avaliacao.dto';
import { ListarAvaliacoesDto } from './dto/listar-avaliacoes.dto';

const avaliacaoSelect = {
  id: true,
  agendamentoId: true,
  nota: true,
  comentario: true,
  criadoEm: true,
  atualizadoEm: true,
} satisfies Prisma.AvaliacaoSelect;

@Injectable()
export class AvaliacoesService {
  private readonly logger = new Logger(AvaliacoesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CriarAvaliacaoDto, user: JwtPayload) {
    this.exigirPaciente(user);
    const agendamento = await this.prisma.agendamento.findUnique({
      where: { id: dto.agendamentoId },
      select: { status: true, paciente: { select: { usuarioId: true } } },
    }).catch((error: unknown) => { throw this.mapearErro(error, 'consultarAgendamento'); });
    if (!agendamento) throw new NotFoundException('Agendamento não encontrado.');
    if (agendamento.paciente.usuarioId !== user.sub) {
      throw new ForbiddenException('Você só pode avaliar os seus próprios atendimentos.');
    }
    if (agendamento.status !== StatusAgendamento.REALIZADO) {
      throw new ConflictException('A consulta precisa estar realizada para receber uma avaliação.');
    }

    try {
      // A reversão concorrente do status exige coordenação com o módulo de Agendamentos.
      return await this.prisma.avaliacao.create({
        data: { agendamentoId: dto.agendamentoId, nota: dto.nota, comentario: dto.comentario },
        select: avaliacaoSelect,
      });
    } catch (error) {
      throw this.mapearErro(error, 'criar');
    }
  }

  async listar({ pagina, limite }: ListarAvaliacoesDto, user: JwtPayload) {
    const where = this.escopo(user);
    const skip = (pagina - 1) * limite;
    if (skip > 2147483647) {
      throw new BadRequestException('A página solicitada excede o limite de paginação.');
    }
    const [total, avaliacoes] = await this.prisma.$transaction([
      this.prisma.avaliacao.count({ where }),
      this.prisma.avaliacao.findMany({
        where, select: avaliacaoSelect,
        orderBy: [{ criadoEm: 'desc' }, { id: 'desc' }],
        skip, take: limite,
      }),
    ]).catch((error: unknown) => { throw this.mapearErro(error, 'listar'); });
    return { pagina, limite, total, avaliacoes };
  }

  async buscar(id: number, user: JwtPayload) {
    this.validarUsuario(user);
    this.validarId(id);
    const avaliacao = await this.prisma.avaliacao.findUnique({
      where: { id },
      select: {
        ...avaliacaoSelect,
        agendamento: {
          select: {
            paciente: { select: { usuarioId: true } },
            profissional: { select: { usuarioId: true } },
          },
        },
      },
    }).catch((error: unknown) => { throw this.mapearErro(error, 'buscar'); });
    if (!avaliacao) throw new NotFoundException('Avaliação não encontrada.');
    const { agendamento, ...resposta } = avaliacao;
    const permitido =
      (user.perfil === PerfilUsuario.PACIENTE && agendamento.paciente.usuarioId === user.sub) ||
      (user.perfil === PerfilUsuario.PROFISSIONAL && agendamento.profissional.usuarioId === user.sub);
    if (!permitido) throw new ForbiddenException('Você não tem acesso a esta avaliação.');
    return resposta;
  }

  async atualizar(id: number, dto: AtualizarAvaliacaoDto, user: JwtPayload) {
    this.exigirPaciente(user);
    if (dto.nota === undefined && dto.comentario === undefined) {
      throw new BadRequestException('Informe nota ou comentário para atualizar.');
    }
    await this.buscar(id, user);
    try {
      return await this.prisma.avaliacao.update({
        where: { ...this.escopo(user), id },
        data: { nota: dto.nota, comentario: dto.comentario },
        select: avaliacaoSelect,
      });
    } catch (error) {
      throw this.mapearErro(error, 'atualizar');
    }
  }

  async remover(id: number, user: JwtPayload): Promise<void> {
    this.exigirPaciente(user);
    await this.buscar(id, user);
    try {
      await this.prisma.avaliacao.delete({ where: { ...this.escopo(user), id } });
    } catch (error) {
      throw this.mapearErro(error, 'remover');
    }
  }

  private escopo(user: JwtPayload): Pick<Prisma.AvaliacaoWhereInput, 'agendamento'> {
    this.validarUsuario(user);
    if (user.perfil === PerfilUsuario.PACIENTE) {
      return { agendamento: { paciente: { usuarioId: user.sub } } };
    }
    if (user.perfil === PerfilUsuario.PROFISSIONAL) {
      return { agendamento: { profissional: { usuarioId: user.sub } } };
    }
    throw new ForbiddenException('Seu perfil não tem acesso a avaliações.');
  }

  private exigirPaciente(user: JwtPayload): void {
    this.validarUsuario(user);
    if (user.perfil !== PerfilUsuario.PACIENTE) {
      throw new ForbiddenException('Somente o paciente autor pode alterar avaliações.');
    }
  }

  private validarUsuario(user: JwtPayload): void {
    if (!Number.isInteger(user.sub) || user.sub < 1 || user.sub > 2147483647) {
      throw new UnauthorizedException('Identificação do usuário inválida.');
    }
  }

  private validarId(id: number): void {
    if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
      throw new BadRequestException('O id deve ser um inteiro positivo válido.');
    }
  }

  private mapearErro(error: unknown, operacao: string): unknown {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') return new ConflictException('Já existe uma avaliação para esta consulta.');
      if (error.code === 'P2025') return new NotFoundException('Avaliação não encontrada.');
      if (error.code === 'P2003') return new ConflictException('O agendamento vinculado não está mais disponível.');
    }
    const erroId = randomUUID();
    this.logger.error({
      mensagem: 'Falha ao acessar avaliações.', operacao, erroId,
      categoria: error instanceof Prisma.PrismaClientKnownRequestError ? error.code
        : error instanceof Prisma.PrismaClientInitializationError ? 'inicializacao_prisma'
        : error instanceof Prisma.PrismaClientValidationError ? 'validacao_prisma'
        : error instanceof Prisma.PrismaClientRustPanicError ? 'panic_prisma'
        : error instanceof Prisma.PrismaClientUnknownRequestError ? 'requisicao_prisma'
        : 'erro_inesperado',
    });
    return new InternalServerErrorException({
      statusCode: 500, error: 'Internal Server Error', erroId,
      message: 'Não foi possível concluir a operação de avaliação.',
    });
  }
}
