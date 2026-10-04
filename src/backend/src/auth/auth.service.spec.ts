import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PerfilUsuario } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: { usuario: { findUnique: jest.Mock } };
  let jwtService: { signAsync: jest.Mock };
  let configService: { get: jest.Mock };

  const usuarioFixture = {
    id: 1,
    nome: 'Maria Silva',
    email: 'maria@email.com',
    senhaHash: 'hash-qualquer',
    perfil: PerfilUsuario.PACIENTE,
  };

  beforeEach(() => {
    prisma = { usuario: { findUnique: jest.fn() } };
    jwtService = { signAsync: jest.fn().mockResolvedValue('token-fake') };
    configService = { get: jest.fn().mockReturnValue('8h') };

    service = new AuthService(
      prisma as unknown as PrismaService,
      jwtService as unknown as JwtService,
      configService as unknown as ConfigService,
    );
  });

  it('retorna token, expiraEm e dados do usuário quando as credenciais são válidas', async () => {
    prisma.usuario.findUnique.mockResolvedValue(usuarioFixture);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.login({
      email: 'maria@email.com',
      senha: 'senhaSegura123',
    });

    expect(result).toEqual({
      token: 'token-fake',
      expiraEm: 8 * 60 * 60,
      usuario: { id: 1, nome: 'Maria Silva', perfil: PerfilUsuario.PACIENTE },
    });
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: usuarioFixture.id,
      email: usuarioFixture.email,
      perfil: usuarioFixture.perfil,
    });
  });

  it('lança UnauthorizedException quando o usuário não existe', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null);

    await expect(
      service.login({ email: 'nao-existe@email.com', senha: 'qualquer123' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('lança UnauthorizedException quando a senha está incorreta', async () => {
    prisma.usuario.findUnique.mockResolvedValue(usuarioFixture);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login({ email: 'maria@email.com', senha: 'senhaErrada' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
