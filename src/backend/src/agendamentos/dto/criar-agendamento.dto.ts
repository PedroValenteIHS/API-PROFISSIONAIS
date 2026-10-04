import { IsISO8601, IsInt } from 'class-validator';

export class CriarAgendamentoDto {
  @IsInt()
  pacienteId: number;

  @IsInt()
  profissionalId: number;

  @IsISO8601()
  dataHora: string;
}
