import { IsDateString, IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdatePacienteDto {
  @IsOptional()
  @IsString()
  @Length(3, 120)
  nome?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(11, 11)
  cpf?: string;

  @IsOptional()
  @IsString()
  @Length(8, 20)
  telefone?: string;

  @IsOptional()
  @IsDateString()
  dataNascimento?: string;
}
