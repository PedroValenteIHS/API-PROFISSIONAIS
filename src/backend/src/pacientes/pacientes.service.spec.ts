import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma, PerfilUsuario } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PacientesService } from './pacientes.service';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hash-fake'),
}));

type PrismaMock = {
  paciente: {
    create: jest.Mock;
    findMany: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
  };
  usuario: {
    delete: jest.Mock;
  };
};

function createPrismaMock(): PrismaMock {
  return {
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
}

function knownError(code: string): Prisma.PrismaClientKnownRequestError {
  return new Prisma.PrismaClientKnownRequestError('erro simulado', {
    code,
    clientVersion: 'test',
  });
}

describe('PacientesService', () => {
  let service: PacientesService;
  let prisma: PrismaMock;

  const createDto = {
    nome: 'Maria Silva',
    email: 'maria@email.com',
    senha: 'senhaSegura123',
    cpf: '12345678900',
    telefone: '31999999999',
    dataNascimento: '1990-05-10',
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

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new PacientesService(prisma as unknown as PrismaService);
  });

  describe('create', () => {
    it('cria o usuário e o paciente com a senha já em hash', async () => {
      prisma.paciente.create.mockResolvedValue(pacienteFixture);

      const result = await service.create(createDto);

      expect(prisma.paciente.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            cpf: createDto.cpf,
            usuario: {
              create: expect.objectContaining({
                nome: createDto.nome,
                email: createDto.email,
                senhaHash: 'hash-fake',
                perfil: PerfilUsuario.PACIENTE,
              }),
            },
          }),
        }),
      );
      expect(result).toEqual(pacienteFixture);
    });

    it('lança ConflictException quando e-mail/cpf já existem (P2002)', async () => {
      prisma.paciente.create.mockRejectedValue(knownError('P2002'));

      await expect(service.create(createDto)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('retorna a lista de pacientes', async () => {
      prisma.paciente.findMany.mockResolvedValue([pacienteFixture]);

      const result = await service.findAll();

      expect(result).toEqual([pacienteFixture]);
    });
  });

  describe('findOne', () => {
    it('retorna o paciente quando encontrado', async () => {
      prisma.paciente.findUnique.mockResolvedValue(pacienteFixture);

      const result = await service.findOne(1);

      expect(result).toEqual(pacienteFixture);
    });

    it('lança NotFoundException quando não encontrado', async () => {
      prisma.paciente.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('atualiza o paciente existente', async () => {
      prisma.paciente.findUnique.mockResolvedValue(pacienteFixture);
      prisma.paciente.update.mockResolvedValue({
        ...pacienteFixture,
        telefone: '31988887777',
      });

      const result = await service.update(1, { telefone: '31988887777' });

      expect(result.telefone).toBe('31988887777');
    });

    it('lança NotFoundException se o paciente não existe', async () => {
      prisma.paciente.findUnique.mockResolvedValue(null);

      await expect(
        service.update(999, { telefone: '31988887777' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('lança ConflictException quando o update viola unicidade (P2002)', async () => {
      prisma.paciente.findUnique.mockResolvedValue(pacienteFixture);
      prisma.paciente.update.mockRejectedValue(knownError('P2002'));

      await expect(
        service.update(1, { email: 'outro@email.com' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('remove', () => {
    it('remove o usuário vinculado ao paciente', async () => {
      prisma.paciente.findUnique.mockResolvedValue(pacienteFixture);
      prisma.usuario.delete.mockResolvedValue(undefined);

      await service.remove(1);

      expect(prisma.usuario.delete).toHaveBeenCalledWith({
        where: { id: pacienteFixture.usuario.id },
      });
    });

    it('lança ConflictException se houver agendamentos vinculados (P2003)', async () => {
      prisma.paciente.findUnique.mockResolvedValue(pacienteFixture);
      prisma.usuario.delete.mockRejectedValue(knownError('P2003'));

      await expect(service.remove(1)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });
});
