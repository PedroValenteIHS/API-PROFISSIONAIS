import {
  Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe,
  Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { PerfilUsuario } from '@prisma/client';
import { Request } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard, JwtPayload } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AvaliacoesService } from './avaliacoes.service';
import { CriarAvaliacaoDto } from './dto/criar-avaliacao.dto';
import { AtualizarAvaliacaoDto } from './dto/atualizar-avaliacao.dto';
import { ListarAvaliacoesDto } from './dto/listar-avaliacoes.dto';

type AuthenticatedRequest = Request & { user: JwtPayload };

@Controller('avaliacoes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(PerfilUsuario.PACIENTE, PerfilUsuario.PROFISSIONAL)
@UsePipes(new ValidationPipe({
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
}))
export class AvaliacoesController {
  constructor(private readonly service: AvaliacoesService) {}

  @Post()
  @Roles(PerfilUsuario.PACIENTE)
  criar(@Body() dto: CriarAvaliacaoDto, @Req() req: AuthenticatedRequest) {
    return this.service.criar(dto, req.user);
  }

  @Get()
  listar(@Query() query: ListarAvaliacoesDto, @Req() req: AuthenticatedRequest) {
    return this.service.listar(query, req.user);
  }

  @Get(':id')
  buscar(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    return this.service.buscar(id, req.user);
  }

  @Patch(':id')
  @Roles(PerfilUsuario.PACIENTE)
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarAvaliacaoDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.atualizar(id, dto, req.user);
  }

  @Delete(':id')
  @Roles(PerfilUsuario.PACIENTE)
  @HttpCode(204)
  remover(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    return this.service.remover(id, req.user);
  }
}
