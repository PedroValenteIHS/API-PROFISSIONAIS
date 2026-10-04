# ⚙️ Etapa 2: APIs, Web Services e Persistência de Dados Distribuída

Este documento serve como diretriz mestre de engenharia e repositório de evidências para a **Etapa 2: Desenvolvimento de APIs, Web Services e Persistência**. Ele foi estruturado para orientar o desenvolvimento prático do backend distribuído e permitir o acompanhamento e auto-gestão das atividades pelos alunos.

---

## 🎯 Rubricas de Avaliação desta Etapa

Ao final desta Etapa, cada aluno será avaliado individualmente nestas 6 competências (incluindo oportunidades de desenvolvimento e reavaliação):

1. **H34a-SI-G: Gerenciar e documentar serviços de TI**: Gerenciar e documentar serviços de TI, de forma clara e objetiva (Reavaliação teórica e prática a partir do gerenciamento de serviços no backend em [src/backend/](src/backend/)).
2. **H35b-SI-G: Planejar, desenvolver e gerenciar uma arquitetura de aplicação distribuída**: Desenvolver uma arquitetura de aplicação distribuída (Medido no código em [src/backend/](src/backend/) e na seção [Modelagem da Aplicação e Arquitetura de Dados](#2-modelagem-da-aplicacao-e-arquitetura-de-dados)).
3. **H35c-SI-G: Planejar, desenvolver e gerenciar uma arquitetura de aplicação distribuída**: Gerenciar uma arquitetura de aplicação distribuída, testando, implantando e avaliando a solução (Medido na seção [Instruções de Implantação e DevOps](#5-instrucoes-de-implantacao-e-devops)).
4. **H36a-SI-G: Planejar, desenvolver e gerenciar APIs e Web Services**: Planejar e documentar APIs e Web Services, de forma clara e objetiva (Medido na seção [Especificação Avançada de Endpoints](#3-especificacao-avancada-de-endpoints) e atualizações no design de contratos).
5. **H36b-SI-G: Planejar, desenvolver e gerenciar APIs e Web Services**: Desenvolver APIs e Web Services (Medido em [src/backend/](src/backend/) e na construção real dos endpoints).
6. **H36c-SI-G: Planejar, desenvolver e gerenciar APIs e Web Services**: Gerenciar APIs e Web Services, testando, implantando e avaliando a solução (Medido na seção [Estratégia e Relatório de Testes Automatizados](#4-estrategia-e-relatorio-de-testes-automatizados)).

---

## 📅 QUADRO DE CONTRIBUIÇÃO REAL (ETAPA 2)

**Atenção alunos:** Preencham esta tabela para atualizar o andamento das tarefas e quem foi o responsável técnico pela construção do backend. Os nomes, usuários e links de evidências devem corresponder aos entregáveis em [src/backend/](src/backend/).

- **Status admitidos**: `⌛ Não Iniciado` | `📝 Em Progresso` | `✔️ Entregue`
- **Autoria Git**: Indica se há commits desse estudante nos arquivos da tarefa.

**Atividades Semanais desta Etapa** (ver [Cronograma do Semestre](contexto.md#-cronograma-do-semestre-semana--periodo)):
- `ATV2.1` — Desenvolvimento de Funcionalidades - API (Semanas 5 a 8)
- `ATV2.2` — Testes - API (Semana 9)

| Rubrica Curricular | ID Tarefa | Atividade Semanal | Descrição Detalhada da Tarefa | Estudante Responsável | GitHub Username | Status de Entrega | Evidência/Seção Temática | Autoria Git |
| :---: | :---: | :---: | :--- | :--- | :---: | :---: | :--- | :---: |
| **H36b** | `T2.1` | `ATV2.1` | Configuração do Boilerplate da API, Roteamento e Inicialização | Elias Marques Fonseca Mesquita Silva | `eliasfonseca-dev` | `✔️ Entregue` | [Instalação/README](src/backend/README.md) | [ ] |
| **H36b** | `T2.2` | `ATV2.1` | Modelagem e Persistência de Dados (Conexão DB, ORM, Schemas) | Elias Marques Fonseca Mesquita Silva | `eliasfonseca-dev` | `✔️ Entregue` | [Seção 2.1](#21-schema-e-diagrama-entidade-relacionamento) | [ ] |
| **H36b** | `T2.3` | `ATV2.1` | Implementação de Endpoints CRUD e Lógica de Negócios Principal | [Nome do Aluno 3] | `username3` | `⌛ Não Iniciado` | [Seção 3.0](#3-especificacao-avancada-de-endpoints) | [ ] |
| **H36b** | `T2.3.1` | `ATV2.1` | CRUD 1 - Agendamentos (Consultas) | Davi Perrier Cabral | `daavipc` | `📝 Em Progresso` | [Seção 3.0](#3-especificacao-avancada-de-endpoints) | [ ] |
| **H36b** | `T2.3.2` | `ATV2.1` | CRUD 2 - Pacientes | Raphael Henrique Cunha Faria | `RaphaelHCF` |  `✔️ Entregue`| [Seção 3.0](#3-especificacao-avancada-de-endpoints) | [ ] |
| **H36b** | `T2.3.3` | `ATV2.1` | CRUD 3 - Profissionais | [Nome do Aluno] | `username3` | `⌛ Não Iniciado` | [Seção 3.0](#3-especificacao-avancada-de-endpoints) | [ ] |
| **H36b** | `T2.3.4` | `ATV2.1` | CRUD 4 - Especialidades / Disponibilidade | [Nome do Aluno] | `username3` | `⌛ Não Iniciado` | [Seção 3.0](#3-especificacao-avancada-de-endpoints) | [ ] |
| **H36b** | `T2.3.5` | `ATV2.1` | CRUD 5 - Avaliação de Atendimentos | Amanda Magalhães Silva | `amdmags` | `📝 Em Progresso` | [Seção 3.0](#3-especificacao-avancada-de-endpoints) | [ ] |
| **H36b** | `T2.4` | `ATV2.1` | Mecanismo de Segurança da API (Autenticação/Autorização JWT) | Raphael Henrique Cunha Faria | `RaphaelHCF`  |  `✔️ Entregue` | [Seção 3.3](#33-seguranca-e-autorizacao) | [ ] |
| **H35b** | `T2.5` | `ATV2.1` | Gateway, Integração de Serviços Web e Clientes HTTP Externos | Raphael Henrique Cunha Faria |  `RaphaelHCF`  | `✔️ Entregue`  | [Seção 2.2](#22-integracao-e-infraestrutura-distribuida) | [ ] |
| **H36c** | `T2.6` | `ATV2.2` | Desenvolvimento de Testes Automatizados (Unitários/Integração) | Raphael Henrique Cunha Faria |  `RaphaelHCF`  | `✔️ Entregue`  | [Seção 4.0](#4-estrategia-e-relatorio-de-testes-automatizados) | [ ] |
| **H35c** | `T2.7` | `ATV2.1` | Construção de Dockerfile e Configuração de docker-compose | [Nome do Aluno 1] | `username1` | `⌛ Não Iniciado` | [Seção 5.1](#51-conteinerizacao-de-servicos) | [ ] |
| **H36c** | `T2.8` | `ATV2.2` | Proposta de Implantação e Pipeline de CI/CD Backend | [Nome do Aluno 5] | `username5` | `⌛ Não Iniciado` | [Seção 5.2](#52-proposta-de-infraestrutura-de-deploy-e-ambiente-em-producao) | [ ] |

---
# 1. Escopo e Objetivos do Backend

O backend do **MedAgenda** é responsável por centralizar as regras de negócio, autenticação, persistência de dados e integração entre as aplicações Web e Móvel. A solução é desenvolvida em **Node.js com NestJS e TypeScript**, utilizando **PostgreSQL** (hospedado no **Supabase**) como banco de dados principal via **Prisma ORM**.
A aplicação é organizada em módulos de autenticação, cadastros e agendamento, expondo uma API REST única para os clientes. O principal objetivo técnico é garantir consultas rápidas de disponibilidade, consistência nas reservas, prevenção de dupla marcação de horários e desacoplamento das notificações, mantendo uma arquitetura adequada ao escopo de clínicas de pequeno e médio porte.

> **Nota sobre a stack real vs. planejada**: a proposta inicial previa Redis (cache) e RabbitMQ/CloudAMQP (mensageria) hospedados no Render. Dado o tamanho da equipe e o tempo disponível, a Etapa 2 implementou o desacoplamento de notificações com um **event bus em memória** (`@nestjs/event-emitter`) em vez de um broker externo — ver justificativa na Seção 2.2. Redis não foi implementado por falta de um CRUD de Disponibilidade (`T2.3.4`) que o justifique.


---

# 2. Modelagem da Aplicação e Arquitetura de Dados

*(Esta seção atende diretamente à rubrica **H35b**)*

A arquitetura de dados do MedAgenda utiliza o **PostgreSQL** como fonte principal de persistência. A modelagem relacional foi escolhida devido à necessidade de manter integridade entre pacientes, profissionais, especialidades, disponibilidades e agendamentos, além de possibilitar controle transacional durante a reserva de horários.
A aplicação utiliza uma camada de acesso a dados por meio de ORM, mantendo a lógica de persistência separada das regras de negócio implementadas pelos serviços NestJS.

## 2.1. Schema e Diagrama Entidade-Relacionamento

As principais entidades persistidas pelo sistema são:

| Entidade | Responsabilidade |
| --- | --- |
| **Usuario** | Armazena informações comuns de autenticação e identificação dos usuários. |
| **Paciente** | Representa pacientes cadastrados na plataforma. |
| **Profissional** | Representa profissionais de saúde cadastrados na clínica. |
| **Especialidade** | Mantém as especialidades associadas aos profissionais. |
| **Disponibilidade** | Representa os intervalos em que um profissional está disponível para atendimento. |
| **Agendamento** | Representa uma consulta marcada entre um paciente e um profissional. |
| **Avaliacao** | Nota e comentário do paciente sobre uma consulta realizada; no máximo uma avaliação existente por consulta. |

### Relacionamentos

- Um **Usuário** pode possuir um perfil de paciente ou profissional.
- Um **Paciente** pode possuir vários agendamentos.
- Um **Profissional** pode possuir vários agendamentos.
- Um **Profissional** pertence a uma especialidade.
- Uma **Especialidade** pode possuir vários profissionais.
- Um **Profissional** pode possuir vários períodos de disponibilidade.
- Cada **Agendamento** pertence a um paciente e a um profissional.
- Um profissional não pode possuir dois agendamentos no mesmo horário.

### Diagrama Entidade-Relacionamento

<img width="1448" height="1086" alt="image" src="https://github.com/user-attachments/assets/92d43f61-3814-4d2e-aad0-1867034ebfee" />

## 2.2. Integração e Infraestrutura Distribuída

*(Implementado na T2.5 — Gateway, Integração de Serviços Web e Clientes HTTP Externos)*

A arquitetura backend do **MedAgenda** utiliza uma API desenvolvida em **Node.js com NestJS e TypeScript**, responsável por centralizar o acesso aos serviços de autenticação, cadastros e agendamento. As operações síncronas (CRUD, login) respondem via REST sobre HTTPS; a confirmação de agendamento é desacoplada de forma assíncrona.

**Gateway (autenticação, roteamento e limite de requisições)**: como a solução é um monólito modular (não microsserviços físicos separados), as responsabilidades de Gateway descritas no `contexto.md` ficam centralizadas na própria API NestJS:
- Autenticação e roteamento: `JwtAuthGuard`/`RolesGuard` (T2.4) e o prefixo global `/api/v1`.
- **Rate limiting**: `@nestjs/throttler`, configurado globalmente (`ThrottlerGuard` via `APP_GUARD`) com limite de 100 requisições por IP a cada 60 segundos. Requisições excedentes recebem `429 Too Many Requests`.

**Notificação assíncrona (`RNF-206`)**: ao criar um agendamento, um evento `agendamento.criado` é publicado e consumido de forma assíncrona por `NotificacoesListener`, que simula o envio da confirmação (log). A publicação ocorre num `AgendamentoCriadoInterceptor` global, que observa a rota `POST /api/v1/agendamentos` **sem alterar o controller/service de Agendamentos** (módulo de outro integrante da equipe). Usa o event bus em memória do NestJS (`@nestjs/event-emitter`) como substituto do RabbitMQ/CloudAMQP previsto originalmente — simplificação necessária dado o tamanho da equipe; a interface de publicação/consumo foi desenhada para ser substituída por uma fila real sem reescrever a lógica de negócio.

**Cliente HTTP externo**: módulo `src/integracoes/cep/`, usando `@nestjs/axios`, consulta a API pública do **ViaCEP** para validar/completar endereços (`GET /api/v1/integracoes/cep/:cep`).

O **PostgreSQL** (hospedado no **Supabase**, não no Render como previsto inicialmente — ver nota na Seção 1) é utilizado como banco de dados principal, com controle transacional para impedir que dois pacientes reservem o mesmo profissional no mesmo horário. Redis não foi implementado: não há ainda um CRUD de Disponibilidade (`T2.3.4`) cujas consultas justifiquem cache — fica documentado como próximo passo.

---

# 3. Especificação Avançada de Endpoints

*(Esta seção atende diretamente à rubrica **H36b**)*

Abaixo devem estar listados os contratos reais que foram ou serão implementados no diretório [src/backend/](src/backend/). Cada endpoint deve ser detalhado descrevendo métodos HTTP, URLs, payloads aceitos e possíveis status codes.

### 3.1. Relação Geral de Endpoints

| Método / Verbo | Caminho da Rota (URI) | Descrição do Recurso / Ação | Reclama Autenticação? | Responsável Técnico |
| :---: | :--- | :--- | :---: | :---: |
| `POST` | `/api/v1/auth/login` | Autenticação e geração de JWT | Não | Raphael Henrique Cunha Faria |
| `POST` | `/api/v1/pacientes` | Cadastro de paciente (cria `Usuario` + `Paciente` juntos) | Não | Raphael Henrique Cunha Faria |
| `GET` | `/api/v1/pacientes` | Lista todos os pacientes | Sim (`RECEPCAO`/`PROFISSIONAL`) | Raphael Henrique Cunha Faria |
| `GET` | `/api/v1/pacientes/{id}` | Consulta um paciente pelo id (o próprio paciente ou staff) | Sim | Raphael Henrique Cunha Faria |
| `PATCH` | `/api/v1/pacientes/{id}` | Atualiza dados do paciente (o próprio paciente ou staff) | Sim | Raphael Henrique Cunha Faria |
| `DELETE` | `/api/v1/pacientes/{id}` | Remove o paciente (o próprio paciente ou staff) | Sim | Raphael Henrique Cunha Faria |
| `POST` | `/api/v1/agendamentos` | Cria um agendamento em horário livre do profissional | Sim | Davi Perrier Cabral |
| `GET` | `/api/v1/agendamentos/{id}` | Consulta um agendamento pelo id | Sim | Davi Perrier Cabral |
| `GET` | `/api/v1/pacientes/{id}/agendamentos` | Lista os agendamentos do paciente, com filtro opcional por status | Sim | Davi Perrier Cabral |
| `PATCH` | `/api/v1/agendamentos/{id}/status` | Atualiza o status da consulta (ex.: marcar como realizada) | Sim | Davi Perrier Cabral |
| `DELETE` | `/api/v1/agendamentos/{id}` | Cancela o agendamento (até 2 horas antes) | Sim | Davi Perrier Cabral |
| `POST` | `/api/v1/avaliacoes` | Cria avaliação de consulta realizada | Sim (`PACIENTE` autor) | Amanda Magalhães Silva |
| `GET` | `/api/v1/avaliacoes` | Lista avaliações acessíveis, com paginação | Sim (autor/profissional vinculado) | Amanda Magalhães Silva |
| `GET` | `/api/v1/avaliacoes/{id}` | Consulta avaliação autorizada | Sim (autor/profissional vinculado) | Amanda Magalhães Silva |
| `PATCH` | `/api/v1/avaliacoes/{id}` | Edita nota/comentário | Sim (`PACIENTE` autor) | Amanda Magalhães Silva |
| `DELETE` | `/api/v1/avaliacoes/{id}` | Exclui avaliação fisicamente | Sim (`PACIENTE` autor) | Amanda Magalhães Silva |
| `GET` | `/api/v1/integracoes/cep/{cep}` | Consulta endereço pelo CEP (cliente HTTP externo, ViaCEP) | Não | Raphael Henrique Cunha Faria |

> **Nota sobre registro de usuários:** não existe um endpoint genérico `/api/v1/users/register`. Cada perfil se cadastra pelo recurso correspondente — pacientes via `POST /api/v1/pacientes` (self-service, sem autenticação). O cadastro de `Profissional` (quando implementado) deve exigir autenticação de um usuário `RECEPCAO`, já que esse perfil não deve ser auto-atribuível livremente.

---

### 3.2. Detalhamento dos Payloads de Requisição e Resposta (Exemplos)

#### Endpoint: `/api/v1/auth/login`
- **Verbo**: `POST`
- **Payload de Entrada (JSON)**:
  ```json
  { "email": "maria@email.com", "senha": "senhaSegura123" }
  ```
- **Payload de Resposta de Sucesso (`200 OK`)** — segue o contrato definido em [contexto.md, Seção 5.1](contexto.md#51-autenticacao-apiv1authlogin):
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiraEm": 28800,
    "usuario": { "id": 2, "nome": "Maria Silva", "perfil": "PACIENTE" }
  }
  ```
- **Comportamento em caso de Erro (`401 Unauthorized`)**:
  ```json
  { "message": "E-mail ou senha inválidos.", "error": "Unauthorized", "statusCode": 401 }
  ```

#### Endpoint: `/api/v1/pacientes` (Cadastro de Paciente)
- **Verbo**: `POST`
- **Regra de negócio**: cria o `Usuario` (perfil `PACIENTE`) e o `Paciente` vinculado numa única operação. A senha nunca é retornada, é armazenada como hash.
- **Payload de Entrada (JSON)**:
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
- **Payload de Resposta de Sucesso (`201 Created`)**:
  ```json
  {
    "id": 2,
    "cpf": "12345678900",
    "telefone": "31999999999",
    "dataNascimento": "1990-05-10T00:00:00.000Z",
    "usuario": { "id": 2, "nome": "Maria Silva", "email": "maria@email.com", "criadoEm": "2026-10-01T14:33:25.347Z" }
  }
  ```
- **Comportamento em caso de Erro (`409 Conflict` - E-mail/CPF duplicado)**:
  ```json
  { "message": "Já existe um paciente com este e-mail ou CPF.", "error": "Conflict", "statusCode": 409 }
  ```

#### Endpoint: `/api/v1/pacientes/{id}` (Consulta/Edição/Remoção)
- **Headers Requeridos**: `Authorization: Bearer <token_jwt>`
- **Regra de negócio**: um usuário com perfil `PACIENTE` só acessa o próprio registro (comparação entre o `sub` do token e o `usuarioId` do paciente); `RECEPCAO`/`PROFISSIONAL` acessam qualquer paciente.
- **Comportamento em caso de Erro (`403 Forbidden` - tentando acessar paciente de outra pessoa)**:
  ```json
  { "message": "Você só pode acessar os seus próprios dados.", "error": "Forbidden", "statusCode": 403 }
  ```

#### Endpoint: `/api/v1/agendamentos` (Criação de Agendamento)
- **Verbo**: `POST`
- **Headers Requeridos**: `Authorization: Bearer <token_jwt>`
- **Regra de negócio**: o horário precisa estar livre para o profissional. A especialidade não é enviada, ela vem do cadastro do profissional.
- **Payload de Entrada (JSON)**:
  ```json
  {
    "pacienteId": 42,
    "profissionalId": 7,
    "dataHora": "2026-10-15T14:00:00-03:00"
  }
  ```
- **Payload de Resposta de Sucesso (`201 Created`)**:
  ```json
  {
    "id": 1088,
    "status": "AGENDADO",
    "dataHora": "2026-10-15T14:00:00-03:00",
    "profissional": { "id": 7, "nome": "Dra. Helena Martins" },
    "especialidade": "Dermatologia",
    "criadoEm": "2026-09-30T10:12:00-03:00"
  }
  ```
- **Comportamento em caso de Erro (`409 Conflict` - Horário Ocupado)**:
  ```json
  { "erro": "horario_indisponivel", "mensagem": "Este horário foi ocupado. Escolha outro." }
  ```

#### Endpoint: `/api/v1/agendamentos/{id}/status` (Atualização de Status)
- **Verbo**: `PATCH`
- **Headers Requeridos**: `Authorization: Bearer <token_jwt>`
- **Regra de negócio**: usado pelo profissional para marcar a consulta como realizada. Valores aceitos: `AGENDADO`, `REALIZADO` e `CANCELADO`.
- **Payload de Entrada (JSON)**:
  ```json
  { "status": "REALIZADO" }
  ```
- **Payload de Resposta de Sucesso (`200 OK`)**:
  ```json
  { "id": 1088, "status": "REALIZADO" }
  ```
- **Comportamento em caso de Erro (`404 Not Found`)**:
  ```json
  { "erro": "nao_encontrado", "mensagem": "Agendamento não encontrado." }
  ```

#### Endpoint: `/api/v1/agendamentos/{id}` (Cancelamento)
- **Verbo**: `DELETE`
- **Headers Requeridos**: `Authorization: Bearer <token_jwt>`
- **Regra de negócio**: o registro não é apagado. O status muda para `CANCELADO`, a data fica salva em `canceladoEm` e o horário volta a ficar livre para outro paciente. O cancelamento só é aceito até 2 horas antes da consulta.
- **Payload de Resposta de Sucesso (`200 OK`)**:
  ```json
  { "id": 1088, "status": "CANCELADO", "canceladoEm": "2026-10-14T10:22:00-03:00" }
  ```
- **Comportamento em caso de Erro (`409 Conflict` - Fora do Prazo)**:
  ```json
  { "erro": "prazo_expirado", "mensagem": "Cancelamento permitido até 2 horas antes da consulta." }
  ```

---

### 3.2.1. Avaliação de Atendimentos — T2.3.5 / RF-114

**Responsável:** Amanda Magalhães Silva (`amdmags`).

Regras de negócio: nota inteira de 1 a 5; comentário opcional de até 1.000 caracteres após remover espaços das extremidades; uma avaliação existente por consulta; leitura pelo paciente autor e pelo profissional responsável; recepção sem acesso. Autor pode editar e excluir sem prazo. Exclusão é física, sem histórico, e permite recriação se a consulta estiver `REALIZADO` no momento da nova criação.

**Persistência:** `Avaliacao` possui `id`, `agendamentoId`, `nota`, `comentario`, `criadoEm` e `atualizadoEm`, na tabela `avaliacoes`. A consulta possui zero ou uma avaliação. Paciente/profissional são obtidos pelo agendamento, sem duplicação de IDs. FK com exclusão `Restrict`, índice único em `agendamento_id`, `CHECK (nota BETWEEN 1 AND 5)` na migration e `VARCHAR(1000)` para comentário. Excluir a avaliação não apaga a consulta; apagar fisicamente uma consulta avaliada é bloqueado. `atualizadoEm` é preenchido pelo Prisma, inclusive na criação.

Todas as rotas exigem `Authorization: Bearer <token>`. O `sub` do JWT é comparado com `Paciente.usuarioId` ou `Profissional.usuarioId`, nunca com o ID do paciente/profissional. A listagem e a contagem filtram esse vínculo no banco; a recepção não pode acessar nenhuma rota. O service também verifica autoria para mutações e repete o vínculo no filtro de UPDATE/DELETE, impedindo mutação se o vínculo mudar entre leitura e escrita.

| Método | Rota | Permissão | Sucesso |
| --- | --- | --- | --- |
| POST | `/api/v1/avaliacoes` | Paciente da consulta `REALIZADO` | 201, avaliação criada |
| GET | `/api/v1/avaliacoes` | Paciente: próprias; profissional: próprios atendimentos | 200, lista paginada |
| GET | `/api/v1/avaliacoes/:id` | Autor ou profissional vinculado | 200, avaliação |
| PATCH | `/api/v1/avaliacoes/:id` | Paciente autor | 200, avaliação atualizada |
| DELETE | `/api/v1/avaliacoes/:id` | Paciente autor | 204, sem corpo |

Criação:

```json
{ "agendamentoId": 1088, "nota": 5, "comentario": "Atendimento atencioso." }
```

Resposta de criação, leitura individual e atualização:

```json
{
  "id": 12,
  "agendamentoId": 1088,
  "nota": 5,
  "comentario": "Atendimento atencioso.",
  "criadoEm": "2026-10-01T15:00:00.000Z",
  "atualizadoEm": "2026-10-01T15:00:00.000Z"
}
```

PATCH aceita apenas `nota` e `comentario`, com pelo menos um campo. Campos omitidos permanecem inalterados; `comentario: null` ou texto vazio após remover espaços das extremidades remove o comentário. `nota: null`, strings numéricas, decimais, campos desconhecidos e tentativa de alterar vínculo/datas são rejeitados. Comentário omitido na criação resulta em `null`. IDs devem ser inteiros positivos de 32 bits.

Listagem: `GET /api/v1/avaliacoes?pagina=1&limite=20`. Valores padrão: página 1 e limite 20; limite entre 1 e 100; página entre 1 e 2147483647, com offset `(pagina - 1) * limite` limitado a 2147483647. Ordenação: `criadoEm DESC, id DESC`. Resposta: `{ "pagina": 1, "limite": 20, "total": 1, "avaliacoes": [...] }`. Página sem resultados retorna array vazio. Contagem e busca usam uma transação, sem promessa de snapshot estável entre páginas durante alterações concorrentes.

| Erro HTTP | Situação |
| --- | --- |
| 400 | Payload/query/ID inválido ou PATCH vazio |
| 401 | Token ausente, inválido ou expirado |
| 403 | Perfil bloqueado ou recurso de outro paciente/profissional |
| 404 | Consulta/avaliação inexistente, inclusive remoção concorrente |
| 409 | Consulta não realizada, avaliação duplicada ou FK perdida durante criação |
| 429 | Rate limit global já existente |
| 500 | Falha inesperada, sem conteúdo interno na resposta |

Erros seguem o formato nativo NestJS: `{ "message": "Já existe uma avaliação para esta consulta.", "error": "Conflict", "statusCode": 409 }`. `P2002` vira 409; `P2025`, 404; `P2003`, 409. Respostas usam seleção explícita de campos. Falhas inesperadas de leitura e escrita são convertidas em `InternalServerErrorException` genérica, sem propagar o erro original ao logger padrão do NestJS. O log registra a operação, categoria/código seguro e um UUID `erroId`, também retornado na resposta 500 para correlação. Não registra o erro original, token, credenciais ou comentário. Os testes HTTP verificam todas as chamadas ao logger nessas falhas.

**Dependência de Agendamentos:** o código atual possui o enum `REALIZADO`, mas ainda não implementa a rota documentada de atualização de status. Este CRUD não altera Agendamentos nem impõe irreversibilidade. Seus testes simulam consultas realizadas.

**Integração com Agendamentos:** caso `REALIZADO` possa voltar a outro status, definir o destino das avaliações existentes e como serializar atualização de status e criação de avaliação. A implementação atual verifica o status antes da inserção; uma reversão concorrente pode ocorrer entre essas operações. Uma transação somente na Avaliação, sem coordenar Agendamentos, não resolve necessariamente essa corrida. Após uma reversão, avaliações existentes continuam legíveis/editáveis/excluíveis pelo vínculo; nova criação é recusada enquanto a consulta não estiver `REALIZADO`. Não há exclusão automática, ocultação ou alteração de status. Também alinhar eventual troca de paciente/profissional: como o vínculo vem da consulta, a autorização acompanha esses dados.

**Validação da persistência:** a migration `20261001160000_add_avaliacoes` foi aplicada aos bancos PostgreSQL locais `medagenda_dev` e `medagenda_test`, junto com as três migrations anteriores. Os comandos `prisma migrate deploy` e `prisma migrate status` passaram nos dois bancos, com `DATABASE_URL` e `DIRECT_URL` configuradas explicitamente para endereços locais. A comparação do histórico de migrations com o schema, usando um banco shadow local e `prisma migrate diff --exit-code`, não detectou diferenças. O Supabase compartilhado não foi acessado.

A aplicação NestJS foi iniciada com conexão ao `medagenda_test`. O script versionado `node test/avaliacoes-local.cjs` (na pasta `src/backend`, após `npm run build`, com `TEST_DATABASE_URL` explícita) executou 35 verificações HTTP/PostgreSQL com login real e dados fictícios, removidos ao final.

| Cenário | Resultado no PostgreSQL local |
| --- | --- |
| CRUD | Criação, consulta, listagem, atualização, exclusão e recriação por HTTP com persistência real |
| Nota | Notas 1 e 5 aceitas; 0 e 6 rejeitadas pela API e pela restrição do banco |
| Chave estrangeira | Inserção com agendamento inexistente rejeitada pelo banco |
| Duplicidade | Segunda criação sequencial retornou HTTP 409; duas criações simultâneas retornaram 201/409 e persistiram uma linha; inserção direta rejeitada pelo índice único |
| Comentário | 1.000 caracteres persistidos; 1.001 rejeitados pela API e pelo PostgreSQL |
| Exclusão de consulta avaliada | Bloqueada pela chave estrangeira com `RESTRICT` |
| Permissões | Autor, outro paciente, profissional vinculado e recepção exercitados por HTTP real |

**Validação reproduzível:** o script aceita somente PostgreSQL em `localhost` ou `127.0.0.1`, porta 5432 e banco `medagenda_test`, gera um segredo JWT temporário e remove os dados fictícios ao final. Comentário com 1.000 caracteres foi persistido; 1.001 foi rejeitado pela API e pelo banco. Duas criações HTTP simultâneas retornaram 201 e 409, com exatamente uma avaliação persistida. A coordenação de status/vínculos com Agendamentos permanece pendente.

---

### 3.3. Segurança e Autorização

A autenticação é feita via **JWT (JSON Web Token)**, implementada no módulo `src/auth/`:

- **Login**: `POST /api/v1/auth/login` recebe `email`/`senha`, valida a senha com `bcrypt.compare()` contra o hash salvo em `usuarios.senha_hash` e, se válida, emite um token.
- **Algoritmo de assinatura**: `HS256` (simétrico, chave única `JWT_SECRET` definida em variável de ambiente). Foi escolhido por simplicidade — não há múltiplos serviços precisando *verificar* o token sem poder *emiti-lo*, cenário em que `RS256` (par de chaves assimétrico) se justificaria.
- **Tempo de expiração**: `8h` (configurável via `JWT_EXPIRES_IN`), pensado para cobrir um turno de atendimento sem exigir login repetido.
- **Payload do token**: `{ sub: <id do usuário>, email, perfil }`.
- **Validação**: `JwtAuthGuard` (`src/auth/guards/jwt-auth.guard.ts`) extrai o token do header `Authorization: Bearer <token>` e valida a assinatura/expiração via `JwtService.verifyAsync()`. Não usa `passport`/`passport-jwt` — guard próprio, mais simples pro tamanho do projeto.
- **RBAC (autorização por perfil)**: `RolesGuard` + decorator `@Roles(...)` (`src/auth/decorators/roles.decorator.ts`) leem o campo `perfil` do token e liberam a rota apenas para os perfis informados.

| Perfil | Pode listar todos os pacientes? | Pode ver/editar/remover um paciente específico? |
| :--- | :---: | :--- |
| `PACIENTE` | Não | Só o próprio registro (comparação `token.sub` × `paciente.usuarioId`) |
| `PROFISSIONAL` | Sim | Qualquer paciente |
| `RECEPCAO` | Sim | Qualquer paciente |

**Cadastro (`POST /api/v1/pacientes`) continua público** — é o fluxo de autoatendimento do paciente se registrando na plataforma, por isso não exige token.

> Cada módulo de CRUD é responsável por aplicar `@UseGuards(JwtAuthGuard)`/`@Roles(...)` nas próprias rotas, usando os guards exportados por `AuthModule` — o módulo de autenticação não edita o código de outros CRUDs diretamente, para não gerar conflito entre quem está desenvolvendo cada recurso em paralelo.

---

# 4. Estratégia e Relatório de Testes Automatizados

*(Esta seção atende diretamente à rubrica **H36c**)*

1. **Ferramenta de Asserção Utilizada**: `Jest` (padrão do NestJS), com `ts-jest` para rodar TypeScript direto e `supertest` para os testes e2e via HTTP.
2. **Estratégia**: todos os testes usam o `PrismaService` **mockado** (`jest.fn()`), sem bater no banco real. Isso evita qualquer risco de poluir o banco compartilhado (Supabase) ou de dois colegas rodando testes ao mesmo tempo colidirem. Os testes e2e também usam o `JwtService` real (configurado com um `JWT_SECRET` de teste), validando de ponta a ponta a autenticação e o RBAC — só a camada de persistência é mockada.
3. **Método de Execução do Comando de Teste**:
   - `npm run test` — testes unitários (`*.spec.ts`, ao lado do código em `src/`)
   - `npm run test:cov` — unitários com relatório de cobertura
   - `npm run test:e2e` — testes de integração HTTP (`test/*.e2e-spec.ts`)
4. **Cobertura Alcançada**: o módulo `src/pacientes/pacientes.service.ts` está com **96,87%** de cobertura de statements (testes unitários). Os demais módulos (Agendamentos, Health, Auth) ainda estão em 0% — ver observação abaixo.

### Validação de Avaliações

- `npm run prisma:validate`, `npm run prisma:generate`, `npm run prisma:format` e `npm run build`: passaram, com URLs locais explícitas nos comandos Prisma.
- `npm test -- --runInBand`: 48 testes passaram em 5 suítes; 31 testes são do service de Avaliações.
- `npm run test:e2e -- --runInBand`: 88 testes passaram em 2 suítes; 79 são de Avaliações, com JWT real, Prisma mockado e consultas `REALIZADO` simuladas.
- Cobertura funcional: vínculos com IDs de usuário distintos dos IDs de perfil, permissões, nota/comentário, PATCH parcial/vazio, IDs, paginação/defaults/offset, duplicidade, erros Prisma, exclusão/recriação e resposta genérica de falhas inesperadas. Não foi medida cobertura percentual nesta entrega.
- `git diff --check`: passou. As quatro migrations foram aplicadas nos bancos locais; a comparação com o schema usando shadow local não detectou diferenças.
- Validação com persistência real: 35 verificações HTTP/PostgreSQL passaram, incluindo limite do comentário e criações simultâneas; ver seção 3.2.1.
- Não existem scripts `check`, `format` ou `lint`; sugerida padronização com o grupo. O schema foi formatado pelo comando existente `prisma:format`.

### Quadro de Cobertura de Testes

| Módulo do Sistema | Tipo de Teste | Cenários Avaliados | Status da Suíte |
| :--- | :--- | :--- | :---: |
| **Pacientes — Service** | Unitário (Prisma mockado) | Criação com hash de senha, e-mail/CPF duplicado (409), não encontrado (404), atualização, remoção com agendamentos vinculados (409) | ✔️ Passou (10 testes) |
| **Pacientes — Controller** | e2e (Prisma mockado, JWT real) | Cadastro público, payload inválido (400), acesso sem token (401), RBAC por perfil (403 para `PACIENTE` tentando listar todos), acesso ao próprio registro vs. de outro paciente (403), paciente inexistente (404) | ✔️ Passou (9 testes) |
| **Agendamentos / Health / Auth** | — | Ainda sem testes | ⌛ Não iniciado |

> **Nota para o time**: a infraestrutura de testes (Jest configurado em `package.json`, `test/jest-e2e.json`) já está pronta pra ser reaproveitada por qualquer módulo. Pra testar seu próprio CRUD, siga o padrão usado em `src/pacientes/pacientes.service.spec.ts` (unitário, mock do `PrismaService`) e `test/pacientes.e2e-spec.ts` (e2e, com `overrideProvider(PrismaService)` e um JWT real gerado via `JwtService` pra simular os perfis `PACIENTE`/`PROFISSIONAL`/`RECEPCAO`). Não é necessário configurar nada novo — só importar seu módulo no `Test.createTestingModule`.

---

# 5. Instruções de Implantação e DevOps

*(Esta seção atende diretamente à rubrica **H35c**)*

Abaixo detalhe como a aplicação backend é empacotada de forma portável e como seria o processo ideal de implantação/hospedagem em nuvem (proposta teórica). **Nota:** Não há cobrança de deploy prático em nuvem nesta disciplina; a avaliação consiste na demonstração teórica da arquitetura física proposta e nas automações de build/testes locais.

## 5.1. Conteinerização de Serviços

[Insira aqui a justificativa e os caminhos de arquivos das imagens Docker criadas. Demonstre como múltiplos contêineres se comunicam na mesma rede por meio de um arquivo `docker-compose.yml` que sobe a API de backend juntamente com quaisquer instâncias de banco de dados ou mensageria de forma auto-contida para execução e testes locais.]

- **Caminho do Dockerfile do Backend**: `[src/backend/Dockerfile](src/backend/Dockerfile)` *(adicione o link do arquivo se ele já existir)*
- **Caminho do Docker Compose**: `[docker-compose.yml](docker-compose.yml)` *(opcional se na raiz)*

---

## 5.2. Proposta de Infraestrutura de Deploy e Ambiente em Produção

[Descreva de forma conceitual como seria estruturado o deploy contínuo (CI/CD) para o ambiente de produção. Por exemplo, indique como seria configurado o GitHub Actions para rodar testes locais e como seria a topologia de implantação na nuvem (ex: Render, AWS, Fly.io, Azure).]

- **Modelo de CI/CD Planejado**: [Indique que ações seriam realizadas a cada push/pull request para validar o código, como testes rodando automaticamente.]
- **Arquitetura Física Proposta**: [Apresente as premissas de arquitetura de hospedagem planejadas: onde a API responderia, como seriam geridos os bancos de dados em nuvem e variáveis de ambiente secretas.]

---

# 6. Referências Acadêmicas e de Engenharia

[Registre as referências que deram suporte técnico para a modelagem lógica, banco de dados ou metodologias de automação do backend das APIs.]

1. **DATE, C. J**. *Introdução a Sistemas de Bancos de Dados*. Rio de Janeiro: Elsevier, 2004.
2. **RICHARDSON, Leonard; RUBY, Sam**. *RESTful Web Services*. O'Reilly Media, 2007.
3. [Adicione referências de documentação oficial, SGBDs ou bibliotecas utilizadas].

