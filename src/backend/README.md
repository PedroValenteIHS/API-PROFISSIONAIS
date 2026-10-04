# 📦 MedAgenda — Backend (T2.1 e T2.2)

Este diretório contém a base do backend do **MedAgenda** correspondente às tarefas atribuídas a **Elias Marques Fonseca Mesquita Silva (`eliasfonseca-dev`)** na Etapa 2:

- **T2.1 — Configuração do Boilerplate da API, Roteamento e Inicialização**
- **T2.2 — Modelagem e Persistência de Dados (Conexão DB, ORM, Schemas)**

A implementação segue a arquitetura definida na documentação do projeto: **Node.js + NestJS + TypeScript**, **Prisma ORM** e **PostgreSQL**.

## 1. O que está implementado

### T2.1 — Boilerplate, roteamento e inicialização

- aplicação NestJS em TypeScript;
- organização modular com `AppModule`;
- carregamento de variáveis de ambiente com `@nestjs/config`;
- prefixo global da API: `/api/v1`;
- porta configurável por `PORT` (padrão `3000`);
- `GET /api/v1/health` para validar a inicialização e o roteamento;
- `GET /api/v1/health/database` para validar a conexão com PostgreSQL quando a infraestrutura estiver disponível.

### T2.2 — Modelagem e persistência

- Prisma ORM configurado para PostgreSQL;
- conexão configurada pela variável `DATABASE_URL`;
- `PrismaModule` global e `PrismaService` reutilizável pelos futuros módulos da API;
- schema relacional com as entidades documentadas na Seção 2.1 da Etapa 2:
  - `Usuario`;
  - `Paciente`;
  - `Profissional`;
  - `Especialidade`;
  - `Disponibilidade`;
  - `Agendamento`;
- chaves primárias, chaves estrangeiras, índices e restrições de unicidade;
- restrição de banco para impedir dois agendamentos do mesmo profissional no mesmo horário (`profissionalId + dataHora`).

> Os CRUDs, autenticação/JWT, Docker, Redis, RabbitMQ e demais endpoints pertencem a outras tarefas da Etapa 2 e não são implementados neste módulo base.

## 2. Pré-requisitos

- Node.js 20 ou superior;
- npm;
- PostgreSQL apenas para testar a conexão real/migrations. A API e a rota `/health` podem ser iniciadas antes da infraestrutura de banco estar disponível.

## 3. Instalação

Na pasta `src/backend`:

```bash
npm install
```

## 4. Variáveis de ambiente

Copie `.env.example` para `.env`:

```powershell
Copy-Item .env.example .env
```

Exemplo da configuração:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/medagenda?schema=public"
PORT=3000
```

O arquivo `.env` é local e não deve ser versionado.

## 5. Validar e gerar o Prisma

Validar a modelagem:

```bash
npm run prisma:validate
```

Gerar o Prisma Client:

```bash
npm run prisma:generate
```

Formatar o schema, se necessário:

```bash
npm run prisma:format
```

## 6. Migrations PostgreSQL

O repositório contém uma migration inicial correspondente ao schema atual.

Quando uma instância PostgreSQL estiver disponível, ela pode ser aplicada com:

```bash
npm run prisma:deploy
```

Durante desenvolvimento, novas alterações de schema podem gerar migrations com:

```bash
npm run prisma:migrate -- --name nome_da_migration
```

## 7. Executar a API

```bash
npm run start:dev
```

### Health check da aplicação

Abra:

```text
http://localhost:3000/api/v1/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "service": "medagenda-api"
}
```

### Health check do PostgreSQL

Quando o banco estiver disponível e `DATABASE_URL` estiver correta:

```text
http://localhost:3000/api/v1/health/database
```

Resposta esperada:

```json
{
  "status": "ok",
  "database": "postgresql"
}
```

Se o PostgreSQL ainda não estiver disponível, essa rota retorna `503`, sem impedir o funcionamento do health check geral da API.

## 8. Compilação

```bash
npm run build
```

## 9. Estrutura principal

```text
src/backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── health/
│   │   ├── health.controller.ts
│   │   └── health.module.ts
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── app.module.ts
│   └── main.ts
├── .env.example
├── .gitignore
├── nest-cli.json
├── package.json
├── tsconfig.build.json
└── tsconfig.json
```

## 10. Regra de consistência contra dupla reserva

A proteção estrutural contra dupla reserva está definida no Prisma:

```prisma
@@unique([profissionalId, dataHora], map: "uq_agendamento_profissional_horario")
```

Assim, mesmo quando o CRUD de agendamentos for implementado em outra tarefa, o PostgreSQL terá uma restrição de integridade impedindo dois registros para o mesmo profissional no mesmo instante.

## 11. Módulo de Pacientes — CRUD (T2.3.2)

Implementado em `src/pacientes/`, usando o `PrismaService` sobre o schema definido em T2.2.

Como `Paciente` referencia `Usuario` (nome/e-mail/senha ficam no usuário, não no paciente), a criação de um paciente cria os dois registros numa única operação.

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/api/v1/pacientes` | Cria o `Usuario` (perfil `PACIENTE`) e o `Paciente` vinculado |
| `GET` | `/api/v1/pacientes` | Lista todos os pacientes |
| `GET` | `/api/v1/pacientes/:id` | Busca um paciente por id |
| `PATCH` | `/api/v1/pacientes/:id` | Atualiza dados do paciente e/ou do usuário vinculado |
| `DELETE` | `/api/v1/pacientes/:id` | Remove o usuário (cascata remove o paciente) |

Payload de criação:

```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "senha": "senhaSegura123",
  "cpf": "12345678900",
  "telefone": "31999999999",
  "dataNascimento": "1990-05-10"
}
```

Notas:
- `senha` é obrigatória na criação (nunca retornada nas respostas) e é armazenada como hash (`bcryptjs`) em `usuarios.senha_hash` — a rota de login/JWT (T2.4) ainda não existe, mas a senha já fica persistida corretamente.
- `dataNascimento` foi adicionada ao model `Paciente` pela migration `20260930135312_add_data_nascimento_paciente` (coluna `data_nascimento`, opcional no banco para não quebrar linhas antigas, mas obrigatória no DTO de criação).
- Tentar remover um paciente com agendamentos vinculados retorna `409 Conflict` (restrição de chave estrangeira do model `Agendamento`).
- E-mail ou CPF duplicados retornam `409 Conflict`.

## 12. Avaliação de Atendimentos — T2.3.5

**Responsável:** Amanda Magalhães Silva (`amdmags`).

Módulo `src/avaliacoes/`, com POST/GET em `/api/v1/avaliacoes` e GET/PATCH/DELETE em `/api/v1/avaliacoes/:id`. Todas as rotas exigem JWT. Paciente cria apenas para consulta própria `REALIZADO`; autor lê, edita e exclui; profissional lê apenas avaliações de seus atendimentos; recepção não tem acesso.

Nota inteira 1–5, comentário opcional até 1.000 caracteres após remover espaços das extremidades e uma avaliação existente por consulta. Exclusão física permite recriação, sem histórico. PATCH aceita nota/comentário; `null` limpa comentário, omissão preserva o campo. Listagem: `?pagina=1&limite=20`, limite máximo 100. Os contratos e as limitações estão na [seção 3.2.1 da documentação de APIs](../../docs/backend-apis.md#321-avaliação-de-atendimentos--t235--rf-114).

A migration `20261001160000_add_avaliacoes` foi aplicada e validada nos bancos PostgreSQL locais `medagenda_dev` e `medagenda_test`. A comparação do histórico de migrations com o schema, usando shadow local, não detectou diferenças. O Supabase compartilhado não foi acessado.

A implementação não altera Agendamentos ou suas transições. Verifica `REALIZADO` antes de criar; a reversão concorrente desse status exige coordenação com o módulo de Agendamentos. Avaliações existentes continuam acessíveis pelo vínculo, independentemente do status posterior.

Verificações sem banco compartilhado, na pasta `src/backend`:

```bash
DATABASE_URL='postgresql://local:local@127.0.0.1:5432/medagenda_descartavel' DIRECT_URL='postgresql://local:local@127.0.0.1:5432/medagenda_descartavel' npm run prisma:validate
DATABASE_URL='postgresql://local:local@127.0.0.1:5432/medagenda_descartavel' DIRECT_URL='postgresql://local:local@127.0.0.1:5432/medagenda_descartavel' npm run prisma:generate
npm run build
npm test -- --runInBand
npm run test:e2e -- --runInBand
```

Validação e geração do Prisma não aplicam migrations. Testes de Avaliação usam Prisma mockado, JWT real e configuração de teste sem carregar `.env`; simulam consultas realizadas. Não comprovam constraints SQL ou concorrência real. O projeto ainda não define scripts `check`, `format` ou `lint`; recomenda-se alinhá-los com o grupo. `prisma:format` cobre apenas o schema.

Resultados registrados: validação e formatação do schema, geração do Prisma Client, compilação e testes aprovados. O módulo de Avaliações possui 31 testes unitários e 79 testes HTTP com persistência simulada. Além desses testes, 35 verificações HTTP/PostgreSQL passaram com a aplicação conectada ao banco local, login real e dados fictícios removidos ao final.

O script versionado `test/avaliacoes-local.cjs` valida HTTP com login real, constraints SQL, limite do comentário e duas criações simultâneas (201/409, uma linha persistida). Aceita somente o banco local descartável `medagenda_test` na porta 5432 e remove os dados fictícios ao final. Com as migrations já aplicadas nesse banco:

```bash
npm run build
TEST_DATABASE_URL='postgresql://local:local@127.0.0.1:5432/medagenda_test' node test/avaliacoes-local.cjs
```

Falhas inesperadas de leitura e escrita de Avaliações retornam 500 genérico, com log sanitizado contendo operação, categoria/código seguro e UUID `erroId`. A resposta 500 inclui o mesmo `erroId` para correlação, sem propagar o erro original ao logger do NestJS. Os testes HTTP verificam resposta e todas as chamadas ao logger.

Permanece pendente a coordenação de status/vínculos com Agendamentos. Os resultados e as limitações estão detalhados na documentação de APIs.
