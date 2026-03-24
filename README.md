Project Overview
This is a Node.js backend API for an acquisitions system built with Express.js. The application uses a modern ES modules setup with TypeScript-like features through Node.js's built-in import maps and path aliases.

Key Technologies
Runtime: Node.js (ES modules)
Framework: Express.js 5.x
Database: PostgreSQL with Neon serverless
ORM: Drizzle ORM
Authentication: JWT with bcrypt password hashing
Validation: Zod schemas
Logging: Winston
Code Quality: ESLint + Prettier

Common Development Commands
Development

# Start development server with file watching

npm run dev:docker

# Start production server

npm run prod:docker

# Apply database migrations

npm run db:migrate

# Run linting (eslint)

npm run lint

# Fix linting issues automatically

npm run lint:fix

# Format code with Prettier

npm run format

# Check code formatting

npm run format:check

Architecture Overview
Entry Point Flow
src/index.js → loads environment variables and imports src/server.js
src/server.js → imports Express app and starts server
src/app.js → main Express application setup with middleware and routes

Directory Structure and Import Aliases
The project uses Node.js import maps for clean module imports:
#config/_ → ./src/config/_ (database, logger configuration)
#controllers/_ → ./src/controllers/_ (request handlers)
#middleware/_ → ./src/middleware/_ (custom middleware - currently empty)
#models/_ → ./src/models/_ (Drizzle ORM models)
#routes/_ → ./src/routes/_ (Express route definitions)
#services/_ → ./src/services/_ (business logic layer)
#utils/_ → ./src/utils/_ (utility functions)
#validations/_ → ./src/validations/_ (Zod validation schemas)
Application Layers
Routes (src/routes/) - Express route definitions
Controllers (src/controllers/) - Handle HTTP requests/responses
Services (src/services/) - Business logic and data operations
Models (src/models/) - Drizzle ORM table definitions
Validations (src/validations/) - Zod schema validations
Utils (src/utils/) - Shared utility functions

Database Architecture
Uses Drizzle ORM with PostgreSQL
Neon serverless database connection
Neon database Branching (/.neon-local) - allows testing of migrations on a copy of the data without touching production.
Use of:
Schema files in src/models/
Migrations generated in drizzle/ directory
Connection configured in src/config/database.js

Authentication Flow
JWT-based authentication with httpOnly cookies
Password hashing with bcrypt (10 rounds)
Rolebased access using auth middleware

User model with roles (user/admin)
Token utilities in src/utils/jwt.js
Cookie utilities in src/utils/cookies.js

Logging Strategy
Winston logger configured in src/config/logger.js
File logging: logs/error.log and logs/combined.log
Console logging in development
Morgan HTTP request logging integrated with Winston

Security Strategy
Arcjet is a security-as-code layer that protects the API from common attacks directly within the application code.
Provides:
Bot Protection
Rate Limiting
Shield: Protects against common vulnerabilities like SQL injection and Cross-Site Scripting.

Environment Configuration
Required environment variables (create .env.development files like in .env_example):
PORT=5173
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key-here
NODE_ENV=development
LOG_LEVEL=info

Development Patterns
Error Handling
Controllers use try-catch with next(error) for error propagation
Custom error messages for business logic violations
Validation errors formatted using formatValidationError utility

Validation Pattern
Zod schemas defined in src/validations/
Controllers validate using schema.safeParse()
Formatted error responses for validation failures

Service Layer Pattern
Business logic separated into service functions
Database operations abstracted from controllers
Reusable functions for common operations

Code Style Guidelines
ESLint Configuration
2-space indentation
Single quotes for strings
Semicolons required
Unix line endings
Arrow functions preferred
No unused variables (except with \_ prefix)

Import/Export Patterns
ES modules with import/export
Use path aliases (#config/\*) instead of relative paths
Named exports for utilities, default exports for main modules

Testing Strategy
Currently nthere are only a few jest-supertest tests set up, but the project structure supports adding:
Unit tests for services and utilities
Integration tests for API endpoints
Database tests using test database

Development Workflow
Make changes to source files
The --watch flag in npm run dev automatically restarts the server
Use npm run lint and npm run format before committing
Database schema changes require running npm run db:generate and npm run db:migrate

Key Files to Understand
src/app.js - Express app configuration and middleware setup
src/config/database.js - Database connection and Drizzle setup
drizzle.config.js - Drizzle ORM configuration
eslint.config.js - Code linting rules and patterns

Containerization & Orchestration
Docker Strategy
The project is fully containerized using Docker with a multi-stage build process to optimize image size and security.
Base Image: node:22-alpine.
User Security: Runs as a non-root nodejs user to follow security best practices.
Optimization: Uses npm ci --only=production to ensure small, immutable images.
Image Registry: Images are versioned and pushed to Docker Hub (<dockerusername>/kubernetes-api).

Kubernetes Architecture (Minikube)
The application is deployed to a Kubernetes cluster (locally via Minikube) using declarative YAML manifests located in k8s/.
scripts/deploy.sh: The automation script for building, pushing, and updating the K8s cluster.
k8s/deployment.yaml: Defines the desired state (replicas, resources, and probes) of the API.
k8s/service.yaml: Manages the networking and external access to the API.
Deployment: Runs 2 replicas for high availability.
Service: Exposed via a LoadBalancer on port 5173.
Health Checks: Implements Liveness and Readiness probes hitting /healthz and /readyz to ensure zero-downtime restarts.

DevOps Commands

# Start minikube

minikube start

# Build, Push, and Deploy to Minikube in one step

npm run deploy:k8s-minikube

CI/CD Pipeline Architecture
The project uses a modular GitHub Actions suite to ensure code quality and deployment reliability. The pipeline is divided into three critical phases:

1. Static Analysis (lint-and-format.yml)
   Purpose: Enforces code style and catches syntax errors early.
   Tools: ESLint for logic/rules and Prettier for formatting.
   Outcome: Prevents "messy" code from being merged into the main branch.
2. Automated Testing (tests.yml)
   Purpose: Validates business logic and API contract integrity.
   Tools: Jest for unit logic and Supertest for HTTP endpoint testing.
   Outcome: Ensures that new changes haven't broken existing features.
3. Containerization (docker-build-docker-push.yml)
   Purpose: Packages the validated application into a production-ready image.
   Tools: Docker Buildx (multi-platform support for amd64 and arm64).
   Outcome: Pushes the final image to Docker Hub (mrkyojin/kubernetes-api) only after the previous stages have passed.
