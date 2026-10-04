import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

interface ViaCepResponse {
  erro?: boolean;
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

@Injectable()
export class CepService {
  constructor(private readonly httpService: HttpService) {}

  async buscar(cep: string) {
    const cepLimpo = cep.replace(/\D/g, '');

    const { data } = await firstValueFrom(
      this.httpService.get<ViaCepResponse>(
        `https://viacep.com.br/ws/${cepLimpo}/json/`,
      ),
    );

    if (data.erro) {
      throw new NotFoundException(`CEP ${cep} não encontrado.`);
    }

    return {
      cep: data.cep,
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      uf: data.uf,
    };
  }
}
