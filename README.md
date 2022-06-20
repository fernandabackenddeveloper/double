# Double Bot

## TechStack
  - MongoDB
  - Redis
  - RabbitMQ
  - TypeScript
  - Scheduler
  - Telegram

## Apps
- Generate Seeds
  - Scheduler que de minuto em minuto vai bater na blaze e pegar as 10 últimas seeds campos
  - Iremos pegar as seeds geradas no nosso banco para determinar quais novas seeds vão ser criadas
  - Salvar no redis e mongodb uma analysis:
    - Essas analysis seram uma lista das 10 últimas seeds geradas com base na data de criação
    - Decidi criar uma analysis por vez pra conseguir replicar se caso for necessário o resultado de uma analisys
    - Cada analysis gerada possuirá um ID que será a key passada por RabbitMQ 
  - Salvar seeds no mongodb:
    - Iremos salvar todas as seeds no mongodb pará possuir um tracker de todas as seeds já coletadas pelo bot
  - Salvar seeds no Redis:
    - Iremos salvas as 10 últimas seeds coletadas pelo sistema
    - Servirá apenas para determinar quais novas seeds seram criadas

- Analyse
  - Receber uma notificação via RabbitMQ com o ID de uma analysis para calcular
  - Pegar a analysis no Redis (banco de cache) (ou mongodb caso não exista em cache) com o ID
  - Gerar um cálculo
    - Color
    - Roll
    - Amounts:
      - Red
      - Black
      - White
    - Total (total apostado em todas as cores)
    - Winner (total ganho pelos apostadores)
    - Rest (Restante na banca)
  - Gerar uma notificação com o resultado do cálculo
  - Salvar a notificação no banco em MongoDB

- Notifications
  - Receber uma notificação via RabbitMQ com um cálculo
  - Formatar a notificação e enviar para o telegram
