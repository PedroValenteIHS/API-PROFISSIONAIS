import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PerfilUsuario } from '@prisma/client';
import { Request } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard, JwtPayload } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { PacientesService } from './pacientes.service';

type AuthenticatedRequest = Request & { user: JwtPayload };

@Controller('pacientes')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Post()
  create(@Body() dto: CreatePacienteDto) {
    return this.pacientesService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(PerfilUsuario.RECEPCAO, PerfilUsuario.PROFISSIONAL)
  @Get()
  findAll() {
    return this.pacientesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const paciente = await this.pacientesService.findOne(id);
    this.assertOwnershipOrStaff(req.user, paciente.usuario.id);
    return paciente;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePacienteDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const paciente = await this.pacientesService.findOne(id);
    this.assertOwnershipOrStaff(req.user, paciente.usuario.id);
    return this.pacientesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const paciente = await this.pacientesService.findOne(id);
    this.assertOwnershipOrStaff(req.user, paciente.usuario.id);
    await this.pacientesService.remove(id);
  }

  private assertOwnershipOrStaff(user: JwtPayload, usuarioId: number): void {
    const isStaff =
      user.perfil === PerfilUsuario.RECEPCAO ||
      user.perfil === PerfilUsuario.PROFISSIONAL;

    if (!isStaff && user.sub !== usuarioId) {
      throw new ForbiddenException('Você só pode acessar os seus próprios dados.');
    }
  }
}
