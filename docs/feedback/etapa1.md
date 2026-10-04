# 📊 Feedback da Etapa 1: Contexto e Planejamento da Solução Distribuída

- **Última Avaliação**: `2026-09-07`

---

## 🌟 Pontos Fortes da Equipe
- Documentação de contexto completa e sem placeholders: problema, personas, requisitos, catálogo de serviços, arquitetura, contratos de API e wireframes web/mobile foram todos preenchidos com conteúdo autoral e tecnicamente coerente entre si.
- Introdução e justificativa claras: o problema (dependência de canais manuais, no-show) está bem delimitado, o objetivo geral decorre diretamente dele e a justificativa é apoiada em dado de mercado (taxa de no-show entre 15% e 30%).
- Arquitetura bem fundamentada e consistente com o catálogo de serviços: o diagrama de componentes (Mermaid) e a tabela de decisões de arquitetura explicam o porquê de cada escolha (gateway único, fila assíncrona de notificação, cache de disponibilidade), e os mesmos 5 serviços aparecem de forma coerente no catálogo, no diagrama e nos contratos de API.
- Wireframes web com evidência concreta: além da descrição textual, o grupo anexou capturas de tela reais das 7 telas do sistema web, indo além do exigido em nível de rascunho.

## ⚠️ Oportunidades de Melhoria
- Requisitos com duplicidade entre RF e RNF: `RF-112` repete a mesma regra de `RNF-208` (impedir agendamento duplicado do mesmo horário) e `RF-113` repete `RNF-202` (Web e Móvel consumindo a mesma API) quase literalmente. A equipe precisa decidir uma única classificação por regra — comportamento do sistema vai em RF, restrição de qualidade/consistência técnica vai em RNF — e eliminar a repetição.
- Desalinhamento entre responsabilidade declarada e autoria real: a tarefa `T1.9` (wireframes mobile, H38a) foi formalmente atribuída a Pedro, mas todo o conteúdo da seção 7 foi escrito, segundo o histórico de commits, pelo colega Elias. O quadro de contribuição marca a tarefa como "Entregue" sem que isso reflita quem de fato produziu o conteúdo.
- Contratos de API incompletos: dois endpoints citados nas telas (cadastro de paciente/profissional na Tela 2 web, busca de profissionais por especialidade na Tela 2 mobile) ainda não têm contrato formal na seção 5 — ficam registrados apenas como pendência textual no próprio documento.
- Concentração de commits em sessões isoladas para alguns integrantes (ex.: Davi concentrou a maior parte do trabalho em um único dia); espalhar os commits ao longo da semana ajuda a refletir melhor o processo iterativo de escrita e facilita o acompanhamento.

---

## 👥 Quadro de Participação da Equipe

| Aluno | Nome | GitHub | Commits | % Participação |
| :---: | :--- | :--- | :---: | :---: |
| Aluno 1 | Davi Perrier Cabral | `daavipc` | `5` | `92%` |
| Aluno 2 | Raphael Henrique Cunha Faria | `RaphaelHCF` | `8` | `94%` |
| Aluno 3 | Elias Marques Fonseca Mesquita Silva | `eliasfonseca-dev` | `7` | `88%` |
| Aluno 4 | Pedro Henrique Valente Paulino | `PedroValenteIHS` | `5` | `66%` |

---

## 🔍 Avaliação Individual por Atividades Entregues

### 👤 Aluno 1: Davi Perrier Cabral
- **✔️ Entregue**: Catálogo de Serviços Web e SLA (H34a), Diagrama de Arquitetura (H35a) e Contratos de API (H36a) — as três tarefas sob sua responsabilidade, com boa profundidade técnica — commit `c8b2aa3`.
- **❌ Pendente/Incompleto**: Nenhuma tarefa própria pendente; falta apenas fechar o contrato de API de cadastro de pacientes/profissionais, já sinalizado como pendência no próprio documento.
- **Parecer**: Participação sólida e completa nas três atividades atribuídas; para a próxima etapa, distribua os commits ao longo da semana em vez de concentrá-los em uma única sessão.

---

### 👤 Aluno 2: Raphael Henrique Cunha Faria
- **✔️ Entregue**: Problema/Objetivos/Justificativa e Personas/Stakeholders (H34a) — commits `ed712bd` a `50ff91a` e `964527b` — e Tecnologias e Hospedagem (H35a) — commits `cd63ea5`, `3d788db`.
- **❌ Pendente/Incompleto**: Nenhuma tarefa própria pendente nesta etapa.
- **Parecer**: Participação consistente e bem distribuída ao longo do período (24/08 e 27/08), com maior volume de commits da equipe e conteúdo que conecta persona, requisito e tecnologia de forma coerente.

---

### 👤 Aluno 3: Elias Marques Fonseca Mesquita Silva
- **✔️ Entregue**: Requisitos Funcionais e Não Funcionais (H34a) — commit `51caf17` — e Wireframes/Fluxograma do Frontend Web (H37a) — commit `c6cc1bf` —, além do apoio na redação da seção de wireframes mobile do colega Pedro (`d7b4eda`).
- **❌ Pendente/Incompleto**: Corrigir a duplicidade de classificação entre `RF-112`/`RNF-208` e `RF-113`/`RNF-202` na tabela de requisitos.
- **Parecer**: Entrega completa e qualificada das duas atividades atribuídas; ajustar a classificação RF/RNF apontada e orientar o grupo a registrar no quadro de contribuição quem de fato escreveu cada seção, já que este aluno cobriu conteúdo além do que lhe foi atribuído.

---

### 👤 Aluno 4: Pedro Henrique Valente Paulino
- **✔️ Entregue**: Inclusão das capturas de tela reais das 7 telas do frontend web — commits `3cfd5b8`, `30b7d42`, `bd1f39d`, `3c02b1e`, `3cac261` — contribuição real, ainda que fora da tarefa formalmente atribuída a ele.
- **❌ Pendente/Incompleto**: Wireframes do Frontend Móvel e Fluxo de Gestos (H38a, tarefa `T1.9`), sua atividade formalmente designada — não há nenhum commit deste aluno na seção 7 do documento; o conteúdo foi escrito por outro integrante.
- **Parecer**: Contribuiu de forma real ao projeto, mas não há evidência de autoria própria na tarefa que lhe foi atribuída. É necessário assumir e registrar diretamente as próprias entregas de mobile a partir da Etapa 2.
