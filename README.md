<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# ForkIt Backend

A NestJS backend application for ForkIt with authentication, user management, and database integration.

## Related Repositories

- [Frontend](https://github.com/KevinDanielDev/forkit-frontend) - Vue 3 frontend application
- [Infrastructure](https://github.com/KevinDanielDev/forkit-infra) - Docker and Kubernetes configurations

## Description

This is the backend API for ForkIt, built with [NestJS](https://github.com/nestjs/nest) framework using TypeScript. The application provides RESTful API endpoints with JWT authentication and PostgreSQL database integration.

## Features

- JWT Authentication with Passport
- User registration and login
- Password encryption with bcrypt
- TypeORM with PostgreSQL database
- Global validation pipes
- Environment variables validation
- API versioning with global prefix (`/api`)

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd forkit-backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials and JWT secret:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=forkit_db
JWT_SECRET=your_jwt_secret
```

## Running the Application

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

The API will be available at `http://localhost:3000/api`

## API Endpoints

### Authentication

- `POST /api/auth/signUp` - Register a new user
- `POST /api/auth/signIn` - Login with email and password
- `POST /api/auth/refreshAccessToken` - Refresh access token
- `POST /api/auth/logOut` - Logout user

<!-- ## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov -->

<!-- ``` -->

## Project Structure

```

src/
├── auth/ # Authentication module
│ ├── dto/ # Data transfer objects
│ ├── guards/ # Auth guards
│ ├── strategies/ # Passport strategies (JWT)
│ └── auth.service.ts
├── users/ # Users module
│ ├── dto/ # User DTOs
│ ├── entities/ # User entity
│ └── users.service.ts
├── database/ # Database configuration
└── main.ts # Application entry point

```

## Technologies Used

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [TypeORM](https://typeorm.io/) - ORM for TypeScript and JavaScript
- [PostgreSQL](https://www.postgresql.org/) - Relational database
- [Passport](http://www.passportjs.org/) - Authentication middleware
- [JWT](https://jwt.io/) - JSON Web Tokens for authentication
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Password hashing
- [class-validator](https://github.com/typestack/class-validator) - Validation decorators
- [Joi](https://joi.dev/) - Environment variables validation

## Development

```bash
# Format code
npm run format

# Lint code
npm run lint
```

## License

This project is [UNLICENSED](LICENSE).
