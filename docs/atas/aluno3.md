# 📊 Portal de Acompanhamento e Avaliação: Aluno 3

- **Nome Completo**: Elias Marques Fonseca Mesquita Silva
- **Usuário do GitHub**: `eliasfonseca-dev`
- **Função Pretendida**: Frontend Web / Testes

---

## 📈 Histórico de Participação por Etapa

| Etapa | % Participação | Commits |
| :---: | :---: | :---: |
| Etapa 1 | `88%` | `7` |

---

## 🔍 Avaliação por Etapa

### 🏗️ ETAPA 1 - Contexto e Planejamento da Solução Distribuída
*   **Participação**: `88%` — Commits: `7`
*   **Atividades Entregues**:
    - Definição de Requisitos Funcionais e Priorização (H34a) — commit `51caf17`: 13 requisitos funcionais e 16 requisitos não funcionais, com canal/categoria, prioridade e rubrica associada.
    - Wireframes do Frontend Web e Fluxograma de Navegação (H37a) — commit `c6cc1bf` (+459 linhas): 7 telas descritas com detalhe de consumo assíncrono de API, fluxograma de navegação e diagrama de sequência em Mermaid, coerentes com os endpoints da seção 5.
    - Contribuição além da tarefa formalmente atribuída: redigiu também todo o conteúdo textual da seção 7 (wireframes mobile, tarefa `T1.9`, formalmente de Pedro) — commit `d7b4eda` (+582 linhas).
*   **Atividades Pendentes/Incompletas**:
    - Nenhuma das duas tarefas próprias ficou pendente.
    - Inconsistência de conteúdo a corrigir: `RF-112` ("Impedir que dois pacientes realizem agendamento para o mesmo profissional, data e horário") descreve a mesma regra de `RNF-208` ("O sistema deve impedir a criação de agendamentos duplicados..."), e `RF-113` ("Permitir que Web e Móvel consumam as funcionalidades por meio da mesma API") duplica `RNF-202` quase literalmente. São a mesma exigência listada duas vezes como funcional e não funcional — o correto é manter a regra de negócio como RF (comportamento do sistema) e a garantia de interoperabilidade/consistência técnica como RNF, sem repetir a mesma frase nas duas tabelas.
*   **Parecer do Professor**: Entrega completa das duas atividades atribuídas, com wireframes web bem conectados aos contratos de API, e apoio relevante ao colega na redação da seção de wireframes mobile — reforçar junto ao grupo que o quadro de contribuição reflita quem de fato escreveu cada trecho. Na tabela de requisitos, os itens `RF-112`/`RNF-208` e `RF-113`/`RNF-202` precisam ser revisados para eliminar a duplicidade entre funcional e não funcional antes da próxima etapa. Trabalho distribuído em mais de uma sessão (27/08 a 29/08), o que é positivo.
