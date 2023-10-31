# Consultório Médico - API de Gerenciamento de Agendamentos

Esta é uma API de gerenciamento de agendamentos para um consultório médico, desenvolvida em Node.js, Express e SQLite. Com esta API, você pode agendar, listar e cancelar consultas médicas de forma eficiente.

## Funcionalidades

- Agendamento de consultas médicas com data, hora, paciente e médico.
- Listagem de consultas agendadas para visualização.
- Cancelamento de consultas marcadas.
- Validação de dados para garantir a integridade das informações.
- Prevenção de agendamento de consultas no passado.
- Detecção de colisões de agendamento para evitar agendamentos duplicados.

## Uso

Siga as etapas abaixo para configurar e usar a API:

1. Clone este repositório em seu ambiente de desenvolvimento.
2. Instale as dependências usando `npm install`.
3. Inicie o servidor com `node app.js`.

## Rotas Disponíveis

- `GET /consultas`: Listar todas as consultas agendadas.
- `POST /consultas`: Agendar uma nova consulta médica.
- `DELETE /consultas/:id`: Cancelar uma consulta pelo seu ID.

## Requisitos

Certifique-se de ter o Node.js instalado em seu sistema.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir problemas, solicitações de pull e propor melhorias.
