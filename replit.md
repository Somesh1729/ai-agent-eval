# AI Agent Evaluation Dashboard

## Overview

The AI Agent Evaluation Dashboard is a full-stack web application for monitoring and analyzing AI agent performance through comprehensive evaluation metrics. It provides a data-driven interface for tracking scores, latency, PII redaction, and various performance flags across AI agent interactions.

The application enables users to:
- Ingest evaluation data via REST API
- Configure evaluation policies and sampling rates
- View real-time performance metrics and KPIs
- Analyze trends over time with interactive charts
- Browse and search through evaluation records
- Manage PII obfuscation and rate limiting settings

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type safety
- Vite as the build tool and dev server
- Wouter for lightweight client-side routing
- React Query (TanStack Query) for server state management

**UI Design System:**
- Shadcn UI component library with Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Dark mode as primary theme (light mode supported via ThemeProvider)
- Design follows modern data dashboard patterns (inspired by Linear, Vercel Analytics)

**Rationale:** This stack prioritizes developer experience, type safety, and performance. Vite provides fast HMR, while Shadcn/Radix ensures accessible, well-tested UI components. React Query handles caching and synchronization elegantly without additional state management overhead.

### Backend Architecture

**Server Framework:**
- Express.js for HTTP server and API routing
- Session-based authentication using express-session
- RESTful API design pattern

**API Endpoints:**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication  
- `POST /api/auth/logout` - Session termination
- `GET /api/auth/me` - Current user info
- `POST /api/evals/ingest` - Evaluation data ingestion
- `GET /api/evals` - Paginated evaluation list with filters
- `GET /api/settings` - User evaluation settings
- `PUT /api/settings` - Update evaluation settings
- `GET /api/stats/dashboard` - Dashboard KPIs and trends
- `GET /api/analytics` - Detailed analytics data

**Authentication Pattern:**
- Sessions stored server-side (no client-side tokens)
- Password hashing with bcrypt (10 rounds)
- Middleware-based route protection via `requireAuth`
- User ID stored in session for all authenticated requests

**Rationale:** Express provides a minimal, unopinionated foundation. Session-based auth is simpler than JWT for this use case and provides better security for a dashboard application. RESTful endpoints follow standard conventions for predictability.

### Data Storage

**Database:**
- PostgreSQL via Neon serverless driver
- Drizzle ORM for type-safe database queries
- Schema-first design with Zod validation

**Schema Design:**
- `users` - Authentication and user identification
- `eval_settings` - Per-user evaluation configuration (run policy, sample rate, PII obfuscation, daily limits)
- `evals` - Evaluation records with scores, latency, flags, and PII metrics

**Key Patterns:**
- Foreign key constraints with cascade deletes for data integrity
- Row-level isolation via userId filtering in all queries
- Timestamp tracking (createdAt/updatedAt) for audit trails
- Array fields for flags to support multiple states per evaluation

**Rationale:** PostgreSQL provides relational integrity and rich query capabilities needed for analytics. Drizzle offers type safety without the complexity of heavier ORMs. The schema design enforces data isolation while enabling efficient queries for dashboards and trends.

### Data Flow & State Management

**Client-Server Communication:**
- React Query handles all server state with automatic caching
- Optimistic updates disabled by default (conservative approach)
- Manual cache invalidation on mutations
- Stale time set to Infinity (explicit refetches only)

**Form Handling:**
- React Hook Form with Zod schema validation
- Validation schemas shared between client and server via /shared
- Type inference from database schema to forms

**Rationale:** React Query eliminates prop drilling and reduces boilerplate for async operations. Shared validation schemas ensure consistency and reduce duplication. Conservative caching prevents stale data issues in an evaluation monitoring context.

### Build & Deployment Strategy

**Development:**
- Vite dev server with HMR for frontend
- tsx for running TypeScript server code directly
- Concurrent dev script runs both client and server

**Production:**
- Vite builds optimized static assets to dist/public
- esbuild bundles server code to dist/index.js (ESM format)
- Single-process deployment (Express serves static files)

**Database Migrations:**
- Drizzle Kit manages schema migrations
- Migration files stored in /migrations
- Manual push via `npm run db:push` command

**Rationale:** This architecture enables efficient development with fast feedback loops while producing a simple, single-process production deployment. ESM throughout ensures modern JavaScript practices.

## External Dependencies

### Core Infrastructure
- **Neon Database** - Serverless PostgreSQL hosting
- **Drizzle ORM** - Type-safe database queries and migrations
- **WebSocket (ws)** - Required by Neon serverless driver for database connections

### UI Component Libraries
- **Radix UI** - Headless, accessible component primitives (20+ components)
- **Shadcn UI** - Pre-styled Radix components with Tailwind
- **Recharts** - Charting library for data visualization
- **Lucide React** - Icon system

### Form & Validation
- **React Hook Form** - Form state management
- **Zod** - Schema validation (shared client/server)
- **@hookform/resolvers** - Zod integration for React Hook Form

### Authentication & Security
- **bcrypt** - Password hashing
- **express-session** - Session management
- **connect-pg-simple** - PostgreSQL session store

### Development Tools
- **@faker-js/faker** - Seed data generation
- **Replit plugins** - Vite plugins for Replit IDE integration (cartographer, dev banner, runtime error overlay)

### Type Safety & Tooling
- **TypeScript** - Type checking across full stack
- **drizzle-zod** - Generate Zod schemas from Drizzle schemas
- **class-variance-authority** - Type-safe component variants
- **clsx & tailwind-merge** - Utility class management
