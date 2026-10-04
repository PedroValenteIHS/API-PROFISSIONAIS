-- Migration preparada para revisão; validar em PostgreSQL local descartável antes de aplicar no banco compartilhado.
CREATE TABLE "avaliacoes" (
    "id" SERIAL NOT NULL,
    "agendamento_id" INTEGER NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" VARCHAR(1000),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "avaliacoes_nota_check" CHECK ("nota" BETWEEN 1 AND 5)
);

CREATE UNIQUE INDEX "avaliacoes_agendamento_id_key" ON "avaliacoes"("agendamento_id");

ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_agendamento_id_fkey"
    FOREIGN KEY ("agendamento_id") REFERENCES "agendamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
