# Express Template Monolith

![Package License](https://img.shields.io/github/license/teo-garcia/express-template-monolith)
![Package Version](https://img.shields.io/github/package-json/v/teo-garcia/express-template-monolith)

This is a monolithic Express template project for building backend applications.

## Requirements

- Node.js 18+
- Docker 24+
- pnpm 8+

## Installation

1. Clone the repository:

```bash
   npx degit teo-garcia/express-template-monolith my-project
```

2. Install dependencies:

```bash
  pnpm install
```

3. Run the project:

```bash
  pnpm dev
```

## Tools

- Express.js
- TypeScript
- Typescript 4.
- ESLint 8 + Prettier 3.
- Husky 8 + Lint Staged 13.
- PostgreSQL
- Passport.js
- JWT

## Commands

| **Command** | **Description**                                      |
| ----------- | ---------------------------------------------------- |
| dev:api     | Start the API server in development mode (Docker).   |
| build:api   | Build the API server (Docker).                       |
| serve:api   | Serve the API using PM2.                             |
| dev:db      | Start the database in development mode (Docker).     |
| build:db    | Build the database (Docker).                         |
| debug:db    | Start pgAdmin for database debugging.                |
| serve:db    | Serve the database using Docker.                     |
| dev         | Concurrently run the API and database (development). |
| build       | Concurrently build the API and serve the database.   |
| migrate:db  | Run database migrations.                             |
