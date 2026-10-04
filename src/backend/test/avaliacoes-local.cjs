// Executar após npm run build, com TEST_DATABASE_URL apontando para medagenda_test local.
const assert = require('node:assert/strict');
const path = require('node:path');
const { createRequire } = require('node:module');
const backend = path.resolve(__dirname, '..');
const load = createRequire(path.join(backend, 'package.json'));
assert.ok(process.env.TEST_DATABASE_URL, 'Defina TEST_DATABASE_URL explicitamente.');
const url = new URL(process.env.TEST_DATABASE_URL);
assert.ok(['postgres:', 'postgresql:'].includes(url.protocol));
assert.ok(['localhost', '127.0.0.1'].includes(url.hostname), 'Somente PostgreSQL local.');
assert.equal(url.port, '5432');
assert.equal(url.pathname, '/medagenda_test', 'Use o banco descartável medagenda_test.');
Object.assign(process.env, {
  DATABASE_URL: url.href, DIRECT_URL: url.href,
  JWT_SECRET: require('node:crypto').randomBytes(32).toString('hex'), JWT_EXPIRES_IN: '1h',
});
load('reflect-metadata');
const { PrismaClient } = load('@prisma/client');
const { NestFactory } = load('@nestjs/core');
const { AppModule } = load('./dist/app.module');
const bcrypt = load('bcryptjs');
const prisma = new PrismaClient({ datasources: { db: { url: url.href } } });
const suffix = require('node:crypto').randomBytes(5).toString('hex');
const users = [];
let specialty, app;
let assertions = 0;
async function main() {
  const connection = await prisma.$queryRaw`SELECT current_database() AS db, inet_server_port() AS port`;
  assert.equal(connection[0].db, 'medagenda_test');
  assert.equal(connection[0].port, 5432);
  const senha = require('node:crypto').randomBytes(16).toString('hex');
  const senhaHash = await bcrypt.hash(senha, 4);
  specialty = await prisma.especialidade.create({ data: { nome: `Especialidade fictícia ${suffix}` } });
  const patient = await prisma.usuario.create({ data: { nome: 'Paciente fictício', email: `paciente-${suffix}@example.invalid`, senhaHash, perfil: 'PACIENTE', paciente: { create: { cpf: String(Date.now()).slice(-11) } } }, include: { paciente: true } }); users.push(patient.id);
  const other = await prisma.usuario.create({ data: { nome: 'Outro paciente fictício', email: `outro-${suffix}@example.invalid`, senhaHash, perfil: 'PACIENTE' } }); users.push(other.id);
  const professional = await prisma.usuario.create({ data: { nome: 'Profissional fictício', email: `profissional-${suffix}@example.invalid`, senhaHash, perfil: 'PROFISSIONAL', profissional: { create: { crm: `FICTICIO-${suffix}`, especialidadeId: specialty.id } } }, include: { profissional: true } }); users.push(professional.id);
  const reception = await prisma.usuario.create({ data: { nome: 'Recepção fictícia', email: `recepcao-${suffix}@example.invalid`, senhaHash, perfil: 'RECEPCAO' } }); users.push(reception.id);
  const consultation = await prisma.agendamento.create({ data: { pacienteId: patient.paciente.id, profissionalId: professional.profissional.id, dataHora: new Date('2026-09-01T12:00:00Z'), status: 'REALIZADO' } });
  const pending = await prisma.agendamento.create({ data: { pacienteId: patient.paciente.id, profissionalId: professional.profissional.id, dataHora: new Date('2026-12-01T12:00:00Z'), status: 'AGENDADO' } });
  app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix('api/v1');
  await app.listen(0, '127.0.0.1');
  const base = `${await app.getUrl()}/api/v1`;
  async function api(method, route, status, token, body) {
    const response = await fetch(base + route, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    const text = await response.text();
    assert.equal(response.status, status, `${method} ${route}: ${text}`);
    assertions++;
    return text ? JSON.parse(text) : null;
  }
  const tokens = {};
  for (const [key, user] of Object.entries({ patient, other, professional, reception })) {
    tokens[key] = (await api('POST', '/auth/login', 201, null, { email: user.email, senha })).token;
    assert.ok(tokens[key]);
  }
  await api('GET', '/health/database', 200);
  await api('GET', '/avaliacoes', 401);
  await api('POST', '/avaliacoes', 409, tokens.patient, { agendamentoId: pending.id, nota: 5 });
  await api('POST', '/avaliacoes', 403, tokens.other, { agendamentoId: consultation.id, nota: 5 });
  await api('POST', '/avaliacoes', 400, tokens.patient, { agendamentoId: consultation.id, nota: 0 });
  await api('POST', '/avaliacoes', 400, tokens.patient, { agendamentoId: consultation.id, nota: 6 });
  const created = await api('POST', '/avaliacoes', 201, tokens.patient, { agendamentoId: consultation.id, nota: 5, comentario: '  Atendimento fictício  ' });
  assert.equal(created.comentario, 'Atendimento fictício');
  await api('POST', '/avaliacoes', 409, tokens.patient, { agendamentoId: consultation.id, nota: 4 });
  for (const nota of [0, 6]) {
    await assert.rejects(prisma.avaliacao.update({ where: { id: created.id }, data: { nota } }), /avaliacoes_nota_check/);
    assertions++;
  }
  await assert.rejects(prisma.avaliacao.create({ data: { agendamentoId: consultation.id, nota: 5 } }), e => e.code === 'P2002'); assertions++;
  await assert.rejects(prisma.avaliacao.create({ data: { agendamentoId: 2147483647, nota: 5 } }), e => e.code === 'P2003'); assertions++;
  await assert.rejects(prisma.agendamento.delete({ where: { id: consultation.id } }), /avaliacoes_agendamento_id_fkey/); assertions++;
  await api('GET', `/avaliacoes/${created.id}`, 200, tokens.patient);
  await api('GET', `/avaliacoes/${created.id}`, 200, tokens.professional);
  await api('GET', `/avaliacoes/${created.id}`, 403, tokens.other);
  await api('GET', `/avaliacoes/${created.id}`, 403, tokens.reception);
  const listed = await api('GET', '/avaliacoes?pagina=1&limite=1', 200, tokens.patient);
  assert.equal(listed.total, 1); assert.equal(listed.avaliacoes[0].id, created.id);
  assert.equal((await api('GET', '/avaliacoes', 200, tokens.professional)).total, 1);
  assert.equal((await api('GET', '/avaliacoes', 200, tokens.other)).total, 0);
  await api('PATCH', `/avaliacoes/${created.id}`, 403, tokens.professional, { nota: 3 });
  await api('PATCH', `/avaliacoes/${created.id}`, 403, tokens.other, { nota: 3 });
  await api('PATCH', `/avaliacoes/${created.id}`, 200, tokens.patient, { comentario: 'a'.repeat(1000) });
  assert.equal((await prisma.avaliacao.findUniqueOrThrow({ where: { id: created.id } })).comentario.length, 1000);
  await api('PATCH', `/avaliacoes/${created.id}`, 400, tokens.patient, { comentario: 'a'.repeat(1001) });
  await assert.rejects(prisma.avaliacao.update({ where: { id: created.id }, data: { comentario: 'a'.repeat(1001) } }), e => e.code === 'P2000'); assertions++;
  const updated = await api('PATCH', `/avaliacoes/${created.id}`, 200, tokens.patient, { nota: 1, comentario: null });
  assert.equal(updated.nota, 1); assert.equal(updated.comentario, null);
  assert.ok(new Date(updated.atualizadoEm) > new Date(created.atualizadoEm));
  assert.equal((await prisma.avaliacao.findUniqueOrThrow({ where: { id: created.id } })).nota, 1);
  await api('DELETE', `/avaliacoes/${created.id}`, 403, tokens.other);
  await api('DELETE', `/avaliacoes/${created.id}`, 204, tokens.patient);
  await api('GET', `/avaliacoes/${created.id}`, 404, tokens.patient);
  const concurrent = await Promise.all([1, 2].map(() => fetch(base + '/avaliacoes', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokens.patient}` },
    body: JSON.stringify({ agendamentoId: consultation.id, nota: 5 }),
  })));
  assert.deepEqual(concurrent.map(r => r.status).sort(), [201, 409]); assertions++;
  assert.equal(await prisma.avaliacao.count({ where: { agendamentoId: consultation.id } }), 1); assertions++;
  console.log(`PASS: ${assertions} verificações HTTP/PostgreSQL; CRUD, login, permissões, CHECK, UNIQUE, FK e RESTRICT.`);
}
main().catch(e => { console.error(e.message); process.exitCode = 1; }).finally(async () => {
  try {
    if (app) { await app.close(); app = undefined; }
    if (users.length) {
      await prisma.avaliacao.deleteMany({ where: { agendamento: { paciente: { usuarioId: { in: users } } } } });
      await prisma.agendamento.deleteMany({ where: { paciente: { usuarioId: { in: users } } } });
      await prisma.usuario.deleteMany({ where: { id: { in: users } } });
    }
    if (specialty) await prisma.especialidade.delete({ where: { id: specialty.id } });
    console.log('Dados fictícios removidos.');
  } finally {
    if (app) await app.close();
    await prisma.$disconnect();
  }
});
