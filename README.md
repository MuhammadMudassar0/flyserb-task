# Full-Stack Messaging Application

This project is a full-stack application built with NestJS and Next.js, using RabbitMQ for asynchronous communication between microservices. It allows users to submit messages via a frontend form, saves the messages in a PostgreSQL database, and sends a confirmation email asynchronously.


## Project Overview

The application consists of three main services:

- Frontend (Next.js) – Handles user interactions and submits messages.
- Save Service (NestJS) – Saves messages to PostgreSQL and publishes a RabbitMQ message.
- Mailer Service (NestJS) – Consumes RabbitMQ messages and sends confirmation emails using SMTP.

Supporting services:

- PostgreSQL – Stores user messages.
- RabbitMQ – Facilitates asynchronous communication between services.

## Folder Structure

.
├── docker-compose.yml          # Docker Compose configuration to run all services
├── README.md                   # Project documentation
├── frontend/                   # Next.js frontend application
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── public/
│   └── src/
├── mailer-service/             # NestJS microservice for sending emails
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   └── test/
└── save-user/                  # NestJS microservice for saving user data
    ├── Dockerfile
    ├── package.json
    ├── tsconfig.json
    ├── src/
    └── test/

## Environment Variables

### Frontend `.env`
NEXT_PUBLIC_API_URL=http://localhost:3001

### Mailer Service `.env`
RABBITMQ_URL=amqp://rabbitmq:5672
RABBITMQ_QUEUE=email_queue

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-app-password

### Save Service `.env`
DB_HOST=postgres
DB_PORT=5432
DB_USER=flyserb
DB_PASSWORD=112233
DB_NAME=flyserb_interview

RABBITMQ_URL=amqp://rabbitmq:5672
RABBITMQ_EXCHANGE=save_exchange
RABBITMQ_ROUTING_KEY=email_queue

## Setup Instructions

1. Clone the repository:
   git clone https://github.com/MuhammadMudassar0/flyserb-task.git

2. Run Docker Compose:
   docker-compose up --build

3. Access the application:
   - Frontend: http://localhost:3000
   - RabbitMQ Management UI: http://localhost:15672 (User: guest, Password: guest)

Optional local development:

- Frontend:
  cd frontend
  npm install
  npm run dev

- Save Service:
  cd save-user
  npm install
  npm run start:dev

- Mailer Service:
  cd mailer-service
  npm install
  npm run start:dev

## Message Flow

1. User submits a message from the frontend.
2. Save Service receives the message via REST API and stores it in PostgreSQL.
3. Save Service publishes a message to RabbitMQ using the `save_exchange` exchange and `email_queue` routing key.
4. Mailer Service consumes messages from `email_queue` and sends a confirmation email via SMTP.

Flow summary: Frontend --> Save Service --> RabbitMQ --> Mailer Service --> Email
