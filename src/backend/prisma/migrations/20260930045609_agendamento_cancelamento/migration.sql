/*
  Warnings:

  - You are about to drop the column `especialidade_id` on the `agendamentos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "agendamentos" DROP CONSTRAINT "agendamentos_especialidade_id_fkey";

-- DropIndex
DROP INDEX "agendamentos_especialidade_id_idx";

-- AlterTable
ALTER TABLE "agendamentos" DROP COLUMN "especialidade_id",
ADD COLUMN     "cancelado_em" TIMESTAMP(3);

-- horario so fica preso enquanto a consulta estiver agendada
DROP INDEX "uq_agendamento_profissional_horario";
CREATE UNIQUE INDEX "uq_agendamento_profissional_horario" ON "agendamentos"("profissional_id", "data_hora") WHERE "status" = 'AGENDADO';
