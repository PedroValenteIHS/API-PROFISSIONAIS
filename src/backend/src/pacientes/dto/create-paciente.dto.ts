import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreatePacienteDto {
  @IsString()
  @Length(3, 120)
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  senha: string;

  @IsString()
  @Length(11, 11)
  cpf: string;

  @IsOptional()
  @IsString()
  @Length(8, 20)
  telefone?: string;

  @IsDateString()
  dataNascimento: string;
}
