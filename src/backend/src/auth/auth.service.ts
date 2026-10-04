import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import ms, { type StringValue } from 'ms';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    const senhaValida = usuario
      ? await bcrypt.compare(dto.senha, usuario.senhaHash)
      : false;

    if (!usuario || !senhaValida) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const token = await this.jwtService.signAsync({
      sub: usuario.id,
      email: usuario.email,
      perfil: usuario.perfil,
    });

    const expiresIn = this.configService.get<string>(
      'JWT_EXPIRES_IN',
      '8h',
    ) as StringValue;

    return {
      token,
      expiraEm: Math.floor(ms(expiresIn) / 1000),
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        perfil: usuario.perfil,
      },
    };
  }
}
