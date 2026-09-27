import { IsString, Length, Matches } from 'class-validator';

export class CreateProfissionalDto {
  @IsString()
  @Length(3, 150)
  nome: string;

  @Matches(/^[0-9]{4,7}$/, { message: 'CRM deve conter entre 4 e 7 dígitos numéricos' })
  crm: string;

  @IsString()
  @Length(2, 2)
  crmUf: string;

  @IsString()
  @Length(2, 100)
  especialidade: string;
}