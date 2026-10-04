import { BadRequestException, ConflictException, ForbiddenException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PerfilUsuario, Prisma, StatusAgendamento } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AvaliacoesService } from './avaliacoes.service';

const paciente = { sub: 42, email: 'paciente@teste.local', perfil: PerfilUsuario.PACIENTE };
const profissional = { sub: 73, email: 'profissional@teste.local', perfil: PerfilUsuario.PROFISSIONAL };
const recepcao = { sub: 99, email: 'recepcao@teste.local', perfil: PerfilUsuario.RECEPCAO };
const avaliacao = {
  id: 12, agendamentoId: 1088, nota: 5, comentario: null,
  criadoEm: new Date('2026-10-01T15:00:00Z'), atualizadoEm: new Date('2026-10-01T15:00:00Z'),
};
const vinculo = {
  paciente: { usuarioId: 42 }, profissional: { usuarioId: 73 },
};

function erroPrisma(code: string) {
  return new Prisma.PrismaClientKnownRequestError('erro de teste', { code, clientVersion: '6.19.0' });
}

describe('AvaliacoesService', () => {
  const prisma = {
    agendamento: { findUnique: jest.fn() },
    avaliacao: { create: jest.fn(), findUnique: jest.fn(), count: jest.fn(), findMany: jest.fn(), update: jest.fn(), delete: jest.fn() },
    $transaction: jest.fn((queries: Promise<unknown>[]) => Promise.all(queries)),
  };
  let service: AvaliacoesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AvaliacoesService(prisma as unknown as PrismaService);
    prisma.agendamento.findUnique.mockResolvedValue({ status: StatusAgendamento.REALIZADO, ...vinculo });
    prisma.avaliacao.findUnique.mockResolvedValue({ ...avaliacao, agendamento: vinculo });
    prisma.avaliacao.create.mockResolvedValue(avaliacao);
    prisma.avaliacao.update.mockResolvedValue({ ...avaliacao, nota: 4 });
    prisma.avaliacao.delete.mockResolvedValue(avaliacao);
  });

  it('cria para o usuário da consulta realizada sem confundir id de paciente e usuário', async () => {
    await expect(service.criar({ agendamentoId: 1088, nota: 5 }, paciente)).resolves.toEqual(avaliacao);
    expect(prisma.avaliacao.create).toHaveBeenCalledWith(expect.objectContaining({ data: { agendamentoId: 1088, nota: 5, comentario: undefined } }));
  });

  it.each([StatusAgendamento.AGENDADO, StatusAgendamento.CANCELADO])('bloqueia criação em %s', async (status) => {
    prisma.agendamento.findUnique.mockResolvedValue({ status, ...vinculo });
    await expect(service.criar({ agendamentoId: 1088, nota: 5 }, paciente)).rejects.toBeInstanceOf(ConflictException);
    expect(prisma.avaliacao.create).not.toHaveBeenCalled();
  });

  it('retorna 404 para consulta inexistente', async () => {
    prisma.agendamento.findUnique.mockResolvedValue(null);
    await expect(service.criar({ agendamentoId: 1088, nota: 5 }, paciente)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('bloqueia criação por outro paciente', async () => {
    await expect(service.criar({ agendamentoId: 1088, nota: 5 }, { ...paciente, sub: 1 })).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.avaliacao.create).not.toHaveBeenCalled();
  });

  it.each([profissional, recepcao])('bloqueia mutações do perfil $perfil no service', async (user) => {
    await expect(service.criar({ agendamentoId: 1088, nota: 5 }, user)).rejects.toBeInstanceOf(ForbiddenException);
    await expect(service.atualizar(12, { nota: 4 }, user)).rejects.toBeInstanceOf(ForbiddenException);
    await expect(service.remover(12, user)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it.each([paciente, profissional])('permite leitura pelo vínculo do perfil $perfil sem expor relações', async (user) => {
    await expect(service.buscar(12, user)).resolves.toEqual(avaliacao);
  });

  it.each([{ ...paciente, sub: 1 }, { ...profissional, sub: 1 }, recepcao])('bloqueia leitura sem vínculo/permissão: $perfil/$sub', async (user) => {
    await expect(service.buscar(12, user)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('retorna 404 para avaliação inexistente', async () => {
    prisma.avaliacao.findUnique.mockResolvedValue(null);
    await expect(service.buscar(12, paciente)).rejects.toBeInstanceOf(NotFoundException);
  });

  it.each([0, -1, 1.5, 2147483648])('rejeita id inválido %s', async (id) => {
    await expect(service.buscar(id, paciente)).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.avaliacao.findUnique).not.toHaveBeenCalled();
  });

  it.each([paciente, profissional])('pagina e restringe contagem e resultados para $perfil', async (user) => {
    prisma.avaliacao.count.mockResolvedValue(21);
    prisma.avaliacao.findMany.mockResolvedValue([avaliacao]);
    const where = { agendamento: { [user.perfil === PerfilUsuario.PACIENTE ? 'paciente' : 'profissional']: { usuarioId: user.sub } } };
    await expect(service.listar({ pagina: 2, limite: 20 }, user)).resolves.toEqual({ pagina: 2, limite: 20, total: 21, avaliacoes: [avaliacao] });
    expect(prisma.avaliacao.count).toHaveBeenCalledWith({ where });
    expect(prisma.avaliacao.findMany).toHaveBeenCalledWith(expect.objectContaining({ where, skip: 20, take: 20, orderBy: [{ criadoEm: 'desc' }, { id: 'desc' }] }));
  });

  it('rejeita offset acima do limite aceito pelo Prisma', async () => {
    await expect(service.listar({ pagina: 2147483647, limite: 100 }, paciente)).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.avaliacao.findMany).not.toHaveBeenCalled();
  });

  it('nega listagem para recepção antes de consultar', async () => {
    await expect(service.listar({ pagina: 1, limite: 20 }, recepcao)).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.avaliacao.count).not.toHaveBeenCalled();
  });

  it('atualiza parcialmente sem exigir status atual ou alterar autoria', async () => {
    await expect(service.atualizar(12, { nota: 4 }, paciente)).resolves.toEqual({ ...avaliacao, nota: 4 });
    expect(prisma.avaliacao.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 12, agendamento: { paciente: { usuarioId: 42 } } }, data: { nota: 4, comentario: undefined } }));
    expect(prisma.agendamento.findUnique).not.toHaveBeenCalled();
  });

  it('remove comentário explicitamente', async () => {
    await service.atualizar(12, { comentario: null }, paciente);
    expect(prisma.avaliacao.update).toHaveBeenCalledWith(expect.objectContaining({ data: { nota: undefined, comentario: null } }));
  });

  it('rejeita PATCH vazio', async () => {
    await expect(service.atualizar(12, {}, paciente)).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.avaliacao.update).not.toHaveBeenCalled();
  });

  it('bloqueia edição e exclusão por outro paciente', async () => {
    const outro = { ...paciente, sub: 1 };
    await expect(service.atualizar(12, { nota: 4 }, outro)).rejects.toBeInstanceOf(ForbiddenException);
    await expect(service.remover(12, outro)).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.avaliacao.update).not.toHaveBeenCalled();
    expect(prisma.avaliacao.delete).not.toHaveBeenCalled();
  });

  it('exclui fisicamente e permite nova criação', async () => {
    await expect(service.remover(12, paciente)).resolves.toBeUndefined();
    expect(prisma.avaliacao.delete).toHaveBeenCalledWith({ where: { id: 12, agendamento: { paciente: { usuarioId: 42 } } } });
    await expect(service.criar({ agendamentoId: 1088, nota: 5 }, paciente)).resolves.toEqual(avaliacao);
  });

  it('traduz erro P2002 de unicidade em 409', async () => {
    prisma.avaliacao.create.mockRejectedValueOnce(erroPrisma('P2002'));
    await expect(service.criar({ agendamentoId: 1088, nota: 5 }, paciente)).rejects.toBeInstanceOf(ConflictException);
  });

  it.each(['atualizar', 'remover'] as const)('traduz remoção concorrente em 404 ao %s', async (operacao) => {
    prisma.avaliacao[operacao === 'atualizar' ? 'update' : 'delete'].mockRejectedValueOnce(erroPrisma('P2025'));
    await expect(operacao === 'atualizar' ? service.atualizar(12, { nota: 4 }, paciente) : service.remover(12, paciente)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('traduz agendamento removido durante criação em 409', async () => {
    prisma.avaliacao.create.mockRejectedValueOnce(erroPrisma('P2003'));
    await expect(service.criar({ agendamentoId: 1088, nota: 5 }, paciente)).rejects.toBeInstanceOf(ConflictException);
  });

  it('converte falhas inesperadas em 500 sem propagar conteúdo sensível', async () => {
    const erro = new Error('conteúdo sensível');
    const log = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    try {
      prisma.avaliacao.create.mockRejectedValueOnce(erro);
      await expect(service.criar({ agendamentoId: 1088, nota: 5 }, paciente)).rejects.toBeInstanceOf(InternalServerErrorException);
      expect(log).toHaveBeenCalledWith({
        mensagem: 'Falha ao acessar avaliações.', operacao: 'criar',
        categoria: 'erro_inesperado', erroId: expect.any(String),
      });
    } finally { log.mockRestore(); }
  });
});
