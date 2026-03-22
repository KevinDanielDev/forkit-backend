# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.2] - 2026-03-22

### Added

- Authentication module with JWT strategy
- User module with CRUD operations
- User entity with email, username, and password fields
- Login endpoint with email/password authentication
- Logout endpoint
- User registration endpoint
- Global API prefix (`/api`)
- Global validation pipes for request validation
- Database connection with TypeORM and PostgreSQL
- Environment variables validation with Joi
- `.env.example` file with required environment variables

### Changed

- Cleaned up NestJS boilerplate code
- Configured global validation pipes
- Added password hashing with bcrypt

### Security

- JWT authentication implementation
- Password encryption using bcrypt
- Environment variables validation on startup

## [0.0.1] - 2026-03-19

### Added

- Initial project setup with NestJS framework
- Basic project structure
- TypeScript configuration
- ESLint and Prettier setup
- Jest testing configuration
