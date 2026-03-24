# Acquisitions API 🚀

A robust Node.js backend for an acquisitions system built with **Express.js 5.x**, **Drizzle ORM**, and **PostgreSQL**. This project features a modern ES modules setup, advanced security with **Arcjet**, and a full **Docker/Kubernetes** deployment pipeline.

## 🛠 Key Technologies

- **Runtime:** Node.js 22 (ES modules)
- **Framework:** Express.js 5.x
- **Database:** PostgreSQL with [Neon Serverless](https://neon.tech)
- **ORM:** Drizzle ORM
- **Security:** Arcjet (Bot Protection, Rate Limiting, Shield WAF)
- **Authentication:** JWT with `httpOnly` cookies & `bcrypt` hashing
- **Validation:** Zod schemas
- **Logging:** Winston + Morgan
- **Code Quality:** ESLint + Prettier

---

## 🏗 Architecture Overview

### Entry Point Flow
`src/index.js` (Env Loader) → `src/server.js` (Server Startup) → `src/app.js` (App Config)

### Directory Structure & Path Aliases
We use Node.js **import maps** for clean module imports using the `#` prefix:
- `#config/*` → `./src/config/*`
- `#controllers/*` → `./src/controllers/*`
- `#middleware/*` → `./src/middleware/*`
- `#models/*` → `./src/models/*`
- `#routes/*` → `./src/routes/*`
- `#services/*` → `./src/services/*`
- `#utils/*` → `./src/utils/*`
- `#validations/*` → `./src/validations/*`

### Application Layers
- **Routes:** Express route definitions.
- **Controllers:** Handle HTTP requests/responses.
- **Services:** Business logic and data operations.
- **Models:** Drizzle ORM table definitions.
- **Validations:** Zod schema validations.
- **Utils:** Shared utility functions.

---

## 🗄 Database Architecture

- **Neon Database Branching:** Uses `/.neon-local` to allow testing migrations on a copy of data without touching production.
- **Schema Management:** Managed via files in `src/models/`.
- **Migrations:** Generated and stored in the `drizzle/` directory.
- **Configuration:** Database connection setup in `src/config/database.js`.

---

## 🔐 Security & Authentication

### Authentication Flow
- JWT-based auth with `httpOnly` cookies.
- Bcrypt password hashing (10 rounds).
- Role-based access control (User/Admin) via auth middleware.
- Utilities in `src/utils/jwt.js` and `src/utils/cookies.js`.

### Arcjet Security
- **Bot Protection:** Blocks malicious automated traffic.
- **Rate Limiting:** Prevents API abuse.
- **Shield:** Protects against SQL injection and Cross-Site Scripting (XSS).

---

## 📊 Logging Strategy

- **Winston:** Configured in `src/config/logger.js`.
- **Files:** Error logs in `logs/error.log` and combined logs in `logs/combined.log`.
- **Console:** Active during development for real-time debugging.
- **Morgan:** Integrated with Winston for HTTP request logging.

---

## 🐳 Containerization & Orchestration

### Docker Strategy
- **Multi-stage builds:** Optimized for small image size and security.
- **Base Image:** `node:22-alpine`.
- **User Security:** Runs as a non-root `nodejs` user.
- **Optimization:** Uses `npm ci --only=production` for immutable builds.
- **Registry:** Pushed to Docker Hub as `mrkyojin/kubernetes-api`.

### Kubernetes Architecture (Minikube)
Declarative manifests are located in `k8s/`:
- **Deployment:** Runs 2 replicas for high availability.
- **Service:** Exposed via `LoadBalancer` on port `5173`.
- **Health Checks:** Liveness and Readiness probes at `/healthz` and `/readyz` for zero-downtime restarts.
- **Automation:** `scripts/deploy.sh` handles building, pushing, and updating the cluster.

---

## 🎡 CI/CD Pipeline Architecture
Automated via GitHub Actions in three phases:
1. **Static Analysis** (`lint-and-format.yml`): Runs ESLint and Prettier.
2. **Automated Testing** (`tests.yml`): Uses Jest and Supertest.
3. **Containerization** (`docker-build-docker-push.yml`): Packages via Docker Buildx and pushes to Docker Hub only if previous stages pass.

---

## 💻 Development Guide

### Common Commands


| Category | Command | Description |
| :--- | :--- | :--- |
| **Dev** | `npm run dev:docker` | Start dev server with file watching |
| | `npm run prod:docker` | Start production server |
| | `npm run db:migrate` | Apply database migrations |
| **Quality**| `npm run lint` | Run ESLint |
| | `npm run lint:fix` | Fix linting issues automatically |
| | `npm run format` | Format code with Prettier |
| **DevOps** | `minikube start` | Start Minikube |
| | `npm run deploy:k8s-minikube` | Build, Push, and Deploy |

### Environment Configuration
Create `.env.development` files based on `.env_example`:
```env
PORT=5173
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key-here
NODE_ENV=development
LOG_LEVEL=info
