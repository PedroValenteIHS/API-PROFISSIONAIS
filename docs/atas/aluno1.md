# 📊 Portal de Acompanhamento e Avaliação: Aluno 1

- **Nome Completo**: Davi Perrier Cabral
- **Usuário do GitHub**: `daavipc`
- **Função Pretendida**: APIs Backend / Arquitetura

---

## 📈 Histórico de Participação por Etapa

| Etapa | % Participação | Commits |
| :---: | :---: | :---: |
| Etapa 1 | `92%` | `5` |

---

## 🔍 Avaliação por Etapa

### 🏗️ ETAPA 1 - Contexto e Planejamento da Solução Distribuída
*   **Participação**: `92%` — Commits: `5`
*   **Atividades Entregues**:
    - Catálogo de Serviços Web e Acordos de SLA (H34a) — commit `c8b2aa3`: 5 serviços mapeados (Autenticação, Agendamento, Disponibilidade, Cadastro, Notificação), com canal, SLA de disponibilidade/tempo de resposta e mecanismo de monitoração para cada um, e observações que justificam por que a notificação tem SLA em minutos e não em segundos.
    - Diagrama de Componentes Físico e Lógico (H35a) — commit `c8b2aa3`: diagrama Mermaid coerente com o catálogo de serviços (mesmos 5 serviços, gateway único, cache e fila), acompanhado de tabela de decisões de arquitetura com o problema que cada decisão resolve.
    - Especificação de Contratos de API (H36a) — commit `c8b2aa3`: 6 endpoints REST documentados (login, disponibilidade, criação/consulta/cancelamento de agendamento, agenda do profissional), com payloads de exemplo e códigos de erro (401/409) coerentes com as regras de negócio do documento.
    - Organização inicial do repositório: README e quadro de distribuição de tarefas da equipe (commits `2314c2a`, `b704572`, `2350be1`) e correção do username do GitHub de um colega no quadro (`78490a7`).
*   **Atividades Pendentes/Incompletas**:
    - Nenhuma das três tarefas formalmente atribuídas ficou pendente.
    - Observação de fechamento: o endpoint de cadastro de pacientes/profissionais (citado no `RF-106` e na Tela 2) ainda não tem contrato formal na seção 5 — o próprio documento registra isso como pendência para uma etapa futura.
*   **Parecer do Professor**: As três atividades sob sua responsabilidade foram entregues com profundidade técnica acima da média — os SLAs são justificados, as decisões de arquitetura explicam o motivo e não apenas o resultado, e os contratos de API trazem exemplos reais e consistentes com as regras de negócio. O trabalho ficou concentrado majoritariamente em uma única sessão (24/08), com um ajuste pontual posterior; para a próxima etapa, distribuir os commits ao longo da semana ajuda a evidenciar o processo iterativo de escrita.
