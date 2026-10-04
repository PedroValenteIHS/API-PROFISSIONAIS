# MedAgenda

`CURSO: Sistemas de Informação`

`DISCIPLINA: Projeto - Arquitetura de Sistemas Distribuídos`

`SEMESTRE: 6º`

O MedAgenda é uma plataforma distribuída para agendamento de consultas em clínicas de pequeno e médio porte. O sistema permite que o paciente encontre profissionais por especialidade, veja os horários disponíveis e marque a consulta pelo celular ou pelo navegador, sem depender de ligação telefônica ou do horário de funcionamento da recepção. A clínica, por sua vez, administra cadastros, agendas e atendimentos por um painel web.

A solução é composta por três aplicações que consomem a mesma API: uma interface web para pacientes e recepção, um painel para os profissionais e um aplicativo móvel para o paciente. No lado do servidor, as responsabilidades foram divididas em serviços independentes, autenticação, agendamento, disponibilidade, cadastros e notificação, sendo o envio de confirmações e lembretes processado de forma assíncrona por fila.

## Integrantes

* [Davi Perrier Cabral](docs/atas/aluno1.md)
* [Raphael Henrique Cunha Faria](docs/atas/aluno2.md)
* [Elias Marques Fonseca Mesquita Silva](docs/atas/aluno3.md)
* [Pedro Henrique Valente Paulino](docs/atas/aluno4.md)
* Fabrício Junio da Silva
* [Amanda Magalhães Silva](docs/atas/aluno5.md)

## Orientador

* Kleber Jacques Ferreira de Souza

# Planejamento

| Etapa         | Atividades (Documentação) | Painel de Feedback e Avaliação |
|  :----:   | ----------- | :---: |
| **ETAPA 1**   | [Documentação de Contexto](docs/contexto.md) | [🔍 Ver Feedback 1](docs/feedback/etapa1.md) |
| **ETAPA 2**   | [APIs, Web Services e Persistência](docs/backend-apis.md) | [🔍 Ver Feedback 2](docs/feedback/etapa2.md) |
| **ETAPA 3**   | [Interface Web Responsiva](docs/frontend-web.md) | [🔍 Ver Feedback 3](docs/feedback/etapa3.md) |
| **ETAPA 4**   | [Interface Móvel Integrada](docs/frontend-mobile.md) | [🔍 Ver Feedback 4](docs/feedback/etapa4.md) |
| **ETAPA 5**   | [Apresentação e Checklist Final](presentation/README.md) | *Consolidado Final* |

## Instruções de utilização

Assim que a primeira versão do sistema estiver disponível, deverá complementar com as instruções de utilização. Descreva como instalar eventuais dependências e como executar a aplicação.

# Código

<li><a href="src/README.md"> Código Fonte</a></li>

# Apresentação

<li><a href="presentation/README.md"> Apresentação da solução</a></li>
