import { ProfissionaisService } from './profissionais.service';
import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';import { CreateProfissionalDto } from './dto/create-profissional.dto';
import { UpdateProfissionalDto } from './dto/update-profissional.dto';
import { QueryProfissionalDto } from './dto/query-profissional.dto';

@Controller('profissionais')
export class ProfissionaisController {
  constructor(private readonly profissionaisService: ProfissionaisService) {}

  @Get()
    findAll(@Query() query: QueryProfissionalDto) {
    return this.profissionaisService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profissionaisService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProfissionalDto) {
  return this.profissionaisService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() 
  dto: UpdateProfissionalDto) {
  return this.profissionaisService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
  return this.profissionaisService.remove(id);
  }
}