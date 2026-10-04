import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { CepService } from './cep.service';

@Controller('integracoes/cep')
export class CepController {
  constructor(private readonly cepService: CepService) {}

  @Get(':cep')
  buscar(@Param('cep') cep: string) {
    if (!/^\d{5}-?\d{3}$/.test(cep)) {
      throw new BadRequestException('CEP inválido. Use o formato 00000000 ou 00000-000.');
    }
    return this.cepService.buscar(cep);
  }
}
