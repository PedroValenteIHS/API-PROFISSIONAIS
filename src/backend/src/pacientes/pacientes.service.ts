import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PerfilUsuario } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

const pacienteSelect = {
  id: true,
  cpf: true,
  telefone: true,
  dataNascimento: true,
  usuario: {
    select: { id: true, nome: true, email: true, criadoEm: true },
  },
} satisfies Prisma.PacienteSelect;

@Injectable()
export class PacientesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePacienteDto) {
    const senhaHash = await bcrypt.hash(dto.senha, 10);

    try {
      return await this.prisma.paciente.create({
        data: {
          cpf: dto.cpf,
          telefone: dto.telefone,
          dataNascimento: new Date(dto.dataNascimento),
          usuario: {
            create: {
              nome: dto.nome,
              email: dto.email,
              senhaHash,
              perfil: PerfilUsuario.PACIENTE,
            },
          },
        },
        select: pacienteSelect,
      });
    } catch (error) {
      throw this.mapKnownError(error);
    }
  }

  findAll() {
    return this.prisma.paciente.findMany({ select: pacienteSelect });
  }

  async findOne(id: number) {
    const paciente = await this.prisma.paciente.findUnique({
      where: { id },
      select: pacienteSelect,
    });
    if (!paciente) {
      throw new NotFoundException(`Paciente com id ${id} não encontrado.`);
    }
    return paciente;
  }

  async update(id: number, dto: UpdatePacienteDto) {
    await this.findOne(id);

    try {
      return await this.prisma.paciente.update({
        where: { id },
        data: {
          cpf: dto.cpf,
          telefone: dto.telefone,
          dataNascimento: dto.dataNascimento
            ? new Date(dto.dataNascimento)
            : undefined,
          usuario: {
            update: {
              nome: dto.nome,
              email: dto.email,
            },
          },
        },
        select: pacienteSelect,
      });
    } catch (error) {
      throw this.mapKnownError(error);
    }
  }

  async remove(id: number): Promise<void> {
    const paciente = await this.findOne(id);

    try {
      await this.prisma.usuario.delete({ where: { id: paciente.usuario.id } });
    } catch (error) {
      throw this.mapKnownError(error);
    }
  }

  private mapKnownError(error: unknown): unknown {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return new ConflictException(
          'Já existe um paciente com este e-mail ou CPF.',
        );
      }
      if (error.code === 'P2003' || error.code === 'P2014') {
        return new ConflictException(
          'Não é possível remover este paciente: existem agendamentos vinculados a ele.',
        );
      }
    }
    return error;
  }
}
