import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { PacientesModule } from '../src/pacientes/pacientes.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('PacientesController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  const prismaMock = {
    paciente: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    usuario: {
      delete: jest.fn(),
    },
  };

  const pacienteFixture = {
    id: 1,
    cpf: '12345678900',
    telefone: '31999999999',
    dataNascimento: new Date('1990-05-10'),
    usuario: {
      id: 1,
      nome: 'Maria Silva',
      email: 'maria@email.com',
      criadoEm: new Date(),
    },
  };

  beforeAll(async () => {
    process.env.JWT_SECRET = 'segredo-de-teste';
    process.env.JWT_EXPIRES_IN = '1h';

    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
        PrismaModule,
        AuthModule,
        PacientesModule,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    jwtService = moduleRef.get(JwtService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function tokenFor(sub: number, perfil: string): string {
    return jwtService.sign({ sub, email: 'teste@email.com', perfil });
  }

  it('POST /pacientes cria paciente sem exigir token', async () => {
    prismaMock.paciente.create.mockResolvedValue(pacienteFixture);

    const response = await request(app.getHttpServer())
      .post('/api/v1/pacientes')
      .send({
        nome: 'Maria Silva',
        email: 'maria@email.com',
        senha: 'senhaSegura123',
        cpf: '12345678900',
        telefone: '31999999999',
        dataNascimento: '1990-05-10',
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBe(1);
  });

  it('POST /pacientes com payload inválido retorna 400', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/pacientes')
      .send({ nome: 'X', email: 'nao-e-email', senha: '123', cpf: '1' });

    expect(response.status).toBe(400);
  });

  it('GET /pacientes sem token retorna 401', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/v1/pacientes',
    );

    expect(response.status).toBe(401);
  });

  it('GET /pacientes com perfil PACIENTE retorna 403 (sem permissão de staff)', async () => {
    const token = tokenFor(1, 'PACIENTE');

    const response = await request(app.getHttpServer())
      .get('/api/v1/pacientes')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  it('GET /pacientes com perfil RECEPCAO retorna 200', async () => {
    prismaMock.paciente.findMany.mockResolvedValue([pacienteFixture]);
    const token = tokenFor(99, 'RECEPCAO');

    const response = await request(app.getHttpServer())
      .get('/api/v1/pacientes')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('GET /pacientes/:id do próprio paciente retorna 200', async () => {
    prismaMock.paciente.findUnique.mockResolvedValue(pacienteFixture);
    const token = tokenFor(1, 'PACIENTE');

    const response = await request(app.getHttpServer())
      .get('/api/v1/pacientes/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('GET /pacientes/:id de outro paciente retorna 403', async () => {
    prismaMock.paciente.findUnique.mockResolvedValue(pacienteFixture);
    const token = tokenFor(2, 'PACIENTE');

    const response = await request(app.getHttpServer())
      .get('/api/v1/pacientes/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  it('GET /pacientes/:id inexistente retorna 404', async () => {
    prismaMock.paciente.findUnique.mockResolvedValue(null);
    const token = tokenFor(99, 'RECEPCAO');

    const response = await request(app.getHttpServer())
      .get('/api/v1/pacientes/999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it('DELETE /pacientes/:id sem token retorna 401', async () => {
    const response = await request(app.getHttpServer()).delete(
      '/api/v1/pacientes/1',
    );

    expect(response.status).toBe(401);
  });
});
