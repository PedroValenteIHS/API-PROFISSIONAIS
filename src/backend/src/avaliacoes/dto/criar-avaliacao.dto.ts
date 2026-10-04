import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CriarAvaliacaoDto {
  @IsInt()
  @Min(1)
  @Max(2147483647)
  agendamentoId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  nota: number;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() || null : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comentario?: string | null;
}
