import { NotFoundException } from '@nestjs/common';
import { of } from 'rxjs';
import { CepService } from './cep.service';

function createHttpServiceMock(data: unknown) {
  return { get: jest.fn().mockReturnValue(of({ data })) };
}

describe('CepService', () => {
  it('retorna o endereço quando o CEP é válido', async () => {
    const httpService = createHttpServiceMock({
      cep: '30130-010',
      logradouro: 'Avenida Afonso Pena',
      bairro: 'Centro',
      localidade: 'Belo Horizonte',
      uf: 'MG',
    });
    const service = new CepService(httpService as any);

    const result = await service.buscar('30130010');

    expect(result).toEqual({
      cep: '30130-010',
      logradouro: 'Avenida Afonso Pena',
      bairro: 'Centro',
      cidade: 'Belo Horizonte',
      uf: 'MG',
    });
  });

  it('lança NotFoundException quando o CEP não existe', async () => {
    const httpService = createHttpServiceMock({ erro: true });
    const service = new CepService(httpService as any);

    await expect(service.buscar('00000000')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
