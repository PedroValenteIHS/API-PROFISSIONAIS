import { INestApplication, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { PerfilUsuario, Prisma, StatusAgendamento } from '@prisma/client';
import request from 'supertest';
import { AvaliacoesModule } from '../src/avaliacoes/avaliacoes.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';

const avaliacao = {
  id: 12, agendamentoId: 1088, nota: 5, comentario: null,
  criadoEm: new Date('2026-10-01T15:00:00Z'), atualizadoEm: new Date('2026-10-01T15:00:00Z'),
};
const vinculo = { paciente: { usuarioId: 42 }, profissional: { usuarioId: 73 } };

describe('AvaliacoesController (HTTP, Prisma mockado)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  const prisma = {
    agendamento: { findUnique: jest.fn() },
    avaliacao: { create: jest.fn(), findUnique: jest.fn(), count: jest.fn(), findMany: jest.fn(), update: jest.fn(), delete: jest.fn() },
    $transaction: jest.fn((queries: Promise<unknown>[]) => Promise.all(queries)),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true, ignoreEnvVars: true, load: [() => ({ JWT_SECRET: 'avaliacoes-segredo-de-teste', JWT_EXPIRES_IN: '1h' })] }),
        PrismaModule, AvaliacoesModule,
      ],
    }).overrideProvider(PrismaService).useValue(prisma).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    jwt = moduleRef.get(JwtService);
    // Sem pipe global: exercita a validação local usada pela aplicação real.
    await app.init();
  });

  afterAll(async () => { await app.close(); });

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.agendamento.findUnique.mockResolvedValue({ status: StatusAgendamento.REALIZADO, ...vinculo });
    prisma.avaliacao.findUnique.mockResolvedValue({ ...avaliacao, agendamento: vinculo });
    prisma.avaliacao.create.mockImplementation(async ({ data }) => ({ ...avaliacao, ...data, comentario: data.comentario ?? null }));
    prisma.avaliacao.update.mockImplementation(async ({ data }) => ({ ...avaliacao, ...Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined)) }));
    prisma.avaliacao.delete.mockResolvedValue(avaliacao);
    prisma.avaliacao.count.mockResolvedValue(1);
    prisma.avaliacao.findMany.mockResolvedValue([avaliacao]);
  });

  function token(sub = 42, perfil: PerfilUsuario = PerfilUsuario.PACIENTE) {
    return jwt.sign({ sub, perfil, email: 'teste@teste.local' });
  }

  it.each([1, 5])('cria com nota %s e retorna somente campos públicos', async (nota) => {
    const response = await request(app.getHttpServer()).post('/api/v1/avaliacoes')
      .set('Authorization', `Bearer ${token()}`).send({ agendamentoId: 1088, nota });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ ...avaliacao, nota, criadoEm: avaliacao.criadoEm.toISOString(), atualizadoEm: avaliacao.atualizadoEm.toISOString() });
  });

  it.each([
    { agendamentoId: 1088 }, { agendamentoId: 1088, nota: 0 },
    { agendamentoId: 1088, nota: 6 }, { agendamentoId: 1088, nota: 1.5 },
    { agendamentoId: 1088, nota: '5' }, { agendamentoId: 1088, nota: null },
    { agendamentoId: 0, nota: 5 }, { agendamentoId: '1088', nota: 5 },
    { agendamentoId: 2147483648, nota: 5 }, { agendamentoId: 1088, nota: 5, pacienteId: 42 },
    { agendamentoId: 1088, nota: 5, comentario: 123 },
    { agendamentoId: 1088, nota: 5, comentario: 'a'.repeat(1001) },
  ])('rejeita criação inválida %#', async (body) => {
    const response = await request(app.getHttpServer()).post('/api/v1/avaliacoes')
      .set('Authorization', `Bearer ${token()}`).send(body);
    expect(response.status).toBe(400);
    expect(prisma.avaliacao.create).not.toHaveBeenCalled();
  });

  it.each([['  atencioso  ', 'atencioso'], ['   ', null], [null, null], ['a'.repeat(1000), 'a'.repeat(1000)]])('normaliza e aceita comentário %#', async (comentario, esperado) => {
    const response = await request(app.getHttpServer()).post('/api/v1/avaliacoes')
      .set('Authorization', `Bearer ${token()}`).send({ agendamentoId: 1088, nota: 5, comentario });
    expect(response.status).toBe(201);
    expect(response.body.comentario).toBe(esperado);
  });

  it.each(['', 'invalido', 'expirado'])('rejeita token %s', async (tipo) => {
    const auth = tipo === 'expirado' ? jwt.sign({ sub: 42, perfil: 'PACIENTE' }, { expiresIn: -1 }) : tipo;
    const response = await request(app.getHttpServer()).get('/api/v1/avaliacoes').set('Authorization', `Bearer ${auth}`);
    expect(response.status).toBe(401);
    expect(prisma.avaliacao.findMany).not.toHaveBeenCalled();
  });

  it.each([undefined, null, '42', 0])('rejeita JWT assinado sem identificação válida %#', async (sub) => {
    const auth = jwt.sign({ sub, perfil: PerfilUsuario.PACIENTE });
    const response = await request(app.getHttpServer()).get('/api/v1/avaliacoes').set('Authorization', `Bearer ${auth}`);
    expect(response.status).toBe(401);
    expect(prisma.avaliacao.findMany).not.toHaveBeenCalled();
  });

  it.each(['post', 'get', 'patch', 'delete'] as const)('nega %s para recepção', async (method) => {
    const path = method === 'post' ? '/api/v1/avaliacoes' : '/api/v1/avaliacoes/12';
    const response = await request(app.getHttpServer())[method](path)
      .set('Authorization', `Bearer ${token(99, PerfilUsuario.RECEPCAO)}`).send({ agendamentoId: 1088, nota: 5 });
    expect(response.status).toBe(403);
  });

  it.each(['post', 'patch', 'delete'] as const)('nega %s para profissional', async (method) => {
    const path = method === 'post' ? '/api/v1/avaliacoes' : '/api/v1/avaliacoes/12';
    const response = await request(app.getHttpServer())[method](path)
      .set('Authorization', `Bearer ${token(73, PerfilUsuario.PROFISSIONAL)}`).send({ nota: 5 });
    expect(response.status).toBe(403);
  });

  it.each([StatusAgendamento.AGENDADO, StatusAgendamento.CANCELADO])('retorna 409 na criação em %s', async (status) => {
    prisma.agendamento.findUnique.mockResolvedValue({ status, ...vinculo });
    const response = await request(app.getHttpServer()).post('/api/v1/avaliacoes')
      .set('Authorization', `Bearer ${token()}`).send({ agendamentoId: 1088, nota: 5 });
    expect(response.status).toBe(409);
  });

  it('retorna contrato 409 para duplicidade detectada pelo banco', async () => {
    prisma.avaliacao.create.mockRejectedValueOnce(new Prisma.PrismaClientKnownRequestError('duplicado', { code: 'P2002', clientVersion: '6.19.0' }));
    const response = await request(app.getHttpServer()).post('/api/v1/avaliacoes')
      .set('Authorization', `Bearer ${token()}`).send({ agendamentoId: 1088, nota: 5 });
    expect(response.status).toBe(409);
    expect(response.body).toEqual({ statusCode: 409, error: 'Conflict', message: 'Já existe uma avaliação para esta consulta.' });
  });

  it.each([[42, PerfilUsuario.PACIENTE], [73, PerfilUsuario.PROFISSIONAL]] as const)('permite leitura vinculada %s/%s', async (sub, perfil) => {
    const response = await request(app.getHttpServer()).get('/api/v1/avaliacoes/12').set('Authorization', `Bearer ${token(sub, perfil)}`);
    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty('agendamento');
  });

  it.each([PerfilUsuario.PACIENTE, PerfilUsuario.PROFISSIONAL])('nega leitura de outro vínculo para %s', async (perfil) => {
    const response = await request(app.getHttpServer()).get('/api/v1/avaliacoes/12').set('Authorization', `Bearer ${token(1, perfil)}`);
    expect(response.status).toBe(403);
  });

  it.each([['42', PerfilUsuario.PACIENTE], ['73', PerfilUsuario.PROFISSIONAL]] as const)('lista apenas o vínculo %s/%s com paginação', async (sub, perfil) => {
    const response = await request(app.getHttpServer()).get('/api/v1/avaliacoes?pagina=2&limite=1')
      .set('Authorization', `Bearer ${token(Number(sub), perfil)}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ pagina: 2, limite: 1, total: 1 });
    expect(prisma.avaliacao.findMany).toHaveBeenCalledWith(expect.objectContaining({
      skip: 1, take: 1,
      where: { agendamento: { [perfil === PerfilUsuario.PACIENTE ? 'paciente' : 'profissional']: { usuarioId: Number(sub) } } },
    }));
  });

  it('usa defaults e retorna lista vazia', async () => {
    prisma.avaliacao.count.mockResolvedValue(0);
    prisma.avaliacao.findMany.mockResolvedValue([]);
    const response = await request(app.getHttpServer()).get('/api/v1/avaliacoes').set('Authorization', `Bearer ${token()}`);
    expect(response.body).toEqual({ pagina: 1, limite: 20, total: 0, avaliacoes: [] });
  });

  it.each(['pagina=0', 'pagina=-1', 'pagina=1.5', 'pagina=abc', 'pagina=2147483648', 'pagina=2147483647&limite=100', 'pagina=', 'limite=0', 'limite=101', 'limite=1.5', 'limite=true', 'pagina=1&pagina=2', 'pacienteId=42'])('rejeita query %s', async (query) => {
    const response = await request(app.getHttpServer()).get(`/api/v1/avaliacoes?${query}`).set('Authorization', `Bearer ${token()}`);
    expect(response.status).toBe(400);
    expect(prisma.avaliacao.findMany).not.toHaveBeenCalled();
  });

  it.each(['0', '-1', '1.5', 'abc', '2147483648'])('rejeita id %s', async (id) => {
    const response = await request(app.getHttpServer()).get(`/api/v1/avaliacoes/${id}`).set('Authorization', `Bearer ${token()}`);
    expect(response.status).toBe(400);
  });

  it.each([{}, { nota: null }, { nota: '4' }, { nota: 6 }, { agendamentoId: 1 }, { criadoEm: '2026-10-01' }, { comentario: 'a'.repeat(1001) }])('rejeita PATCH inválido %#', async (body) => {
    const response = await request(app.getHttpServer()).patch('/api/v1/avaliacoes/12').set('Authorization', `Bearer ${token()}`).send(body);
    expect(response.status).toBe(400);
    expect(prisma.avaliacao.update).not.toHaveBeenCalled();
  });

  it('edita parcialmente e remove comentário', async () => {
    const response = await request(app.getHttpServer()).patch('/api/v1/avaliacoes/12').set('Authorization', `Bearer ${token()}`).send({ nota: 4, comentario: null });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ nota: 4, comentario: null, agendamentoId: 1088 });
  });

  it.each(['patch', 'delete'] as const)('nega %s de outro autor', async (method) => {
    const response = await request(app.getHttpServer())[method]('/api/v1/avaliacoes/12').set('Authorization', `Bearer ${token(1)}`).send({ nota: 4 });
    expect(response.status).toBe(403);
    expect(prisma.avaliacao.update).not.toHaveBeenCalled();
    expect(prisma.avaliacao.delete).not.toHaveBeenCalled();
  });

  it('exclui com 204 e permite recriação', async () => {
    const response = await request(app.getHttpServer()).delete('/api/v1/avaliacoes/12').set('Authorization', `Bearer ${token()}`);
    expect(response.status).toBe(204);
    expect(response.text).toBe('');
    const criado = await request(app.getHttpServer()).post('/api/v1/avaliacoes').set('Authorization', `Bearer ${token()}`).send({ agendamentoId: 1088, nota: 5 });
    expect(criado.status).toBe(201);
  });

  it('retorna 404 para avaliação inexistente', async () => {
    prisma.avaliacao.findUnique.mockResolvedValue(null);
    const response = await request(app.getHttpServer()).get('/api/v1/avaliacoes/12').set('Authorization', `Bearer ${token()}`);
    expect(response.status).toBe(404);
  });

  it('retorna 404 para consulta inexistente', async () => {
    prisma.agendamento.findUnique.mockResolvedValue(null);
    const response = await request(app.getHttpServer()).post('/api/v1/avaliacoes').set('Authorization', `Bearer ${token()}`).send({ agendamentoId: 1088, nota: 5 });
    expect(response.status).toBe(404);
  });

  it.each(['criar', 'consultaAgendamento', 'buscar', 'listar', 'atualizar', 'remover'] as const)('oculta falha inesperada de %s na resposta e em todos os logs', async (operacao) => {
    const erro = new Error('credencial e comentário sensíveis');
    const consultas = {
      criar: prisma.avaliacao.create,
      consultaAgendamento: prisma.agendamento.findUnique,
      buscar: prisma.avaliacao.findUnique,
      listar: prisma.avaliacao.count,
      atualizar: prisma.avaliacao.update,
      remover: prisma.avaliacao.delete,
    };
    consultas[operacao].mockRejectedValueOnce(erro);
    const log = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    try {
      const http = request(app.getHttpServer());
      const chamada = operacao === 'buscar' ? http.get('/api/v1/avaliacoes/12')
        : operacao === 'listar' ? http.get('/api/v1/avaliacoes')
        : operacao === 'atualizar' ? http.patch('/api/v1/avaliacoes/12').send({ nota: 4 })
        : operacao === 'remover' ? http.delete('/api/v1/avaliacoes/12')
        : http.post('/api/v1/avaliacoes').send({ agendamentoId: 1088, nota: 5 });
      const response = await chamada.set('Authorization', `Bearer ${token()}`);
      expect(response.status).toBe(500);
      expect(JSON.stringify(response.body)).not.toContain(erro.message);
      expect(log).toHaveBeenCalledTimes(1);
      expect(response.body.erroId).toMatch(/^[0-9a-f-]{36}$/);
      expect(log).toHaveBeenCalledWith({
        mensagem: 'Falha ao acessar avaliações.',
        operacao: operacao === 'consultaAgendamento' ? 'consultarAgendamento' : operacao,
        categoria: 'erro_inesperado',
        erroId: response.body.erroId,
      });
      expect(JSON.stringify(log.mock.calls)).not.toContain(erro.message);
    } finally { log.mockRestore(); }
  });
});
