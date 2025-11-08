# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Spring Boot 3.5.7 application using Java 21, demonstrating Vaadin UI framework with jOOQ for type-safe database access and PostgreSQL. It's a workshop example for "AI Track and Field."

**Key Technologies:**
- **Framework:** Spring Boot 3.5.7 with Spring Boot DevTools for hot reloading
- **UI:** Vaadin 24.9.3 (server-side Java web framework)
- **Database:** PostgreSQL with jOOQ for type-safe SQL
- **Database Migrations:** Flyway (migrations expected in `src/main/resources/db/migration/`)
- **Testing:** Testcontainers, Karibu Testing (Vaadin UI testing), Playwright for E2E tests

## Build and Run Commands

### Development

Run the application with PostgreSQL in Testcontainers:
```bash
./mvnw spring-boot:test-run
```

This uses `TestAiTrackAndFieldApplication` which configures a PostgreSQL Testcontainer automatically.

Standard Spring Boot run (requires external PostgreSQL):
```bash
./mvnw spring-boot:run
```

### Testing

Run all tests:
```bash
./mvnw test
```

Run tests with verbose output:
```bash
./mvnw -B test
```

### Build

Clean and compile:
```bash
./mvnw clean compile
```

Generate jOOQ classes from database schema:
```bash
./mvnw generate-sources
```

### Production Build

Build for production (includes Vaadin frontend optimization):
```bash
./mvnw clean package -Pproduction
```

## Architecture

### Database Layer

**jOOQ Code Generation:**
- jOOQ classes are generated via `testcontainers-jooq-codegen-maven-plugin` during the `generate-sources` phase
- The plugin spins up a PostgreSQL Testcontainer, applies Flyway migrations from `src/main/resources/db/migration/`, then generates type-safe Java code
- Generated code location: `ch.martinelli.demo.aitaf.db` package
- Uses custom generator: `ch.martinelli.oss.jooq.EqualsAndHashCodeJavaGenerator` for enhanced POJO generation
- Schema: `public`, excluding `flyway_schema_history`

**Database Configuration:**
- PostgreSQL (latest version via Docker)
- Credentials for Testcontainers: username=`aitaf`, password=`aitaf`, database=`aitaf`
- Flyway manages schema migrations

### Testing Infrastructure

**Testcontainers Configuration:**
The application uses Spring Boot Testcontainers integration via `TestcontainersConfiguration`:
- Provides `@ServiceConnection` PostgreSQL container
- Automatically wired into tests via `@Import(TestcontainersConfiguration.class)`
- `TestAiTrackAndFieldApplication` is the entry point for local development with Testcontainers

**Testing Layers:**
1. **Unit/Integration Tests:** Standard Spring Boot tests with Testcontainers
2. **Vaadin UI Tests:** Karibu Testing (`karibu-testing-v10-spring`) for component testing
3. **E2E Tests:** Playwright + Mopo (Playwright helper for Vaadin) for browser automation

**Test Base Classes:**
- `KaribuTest` appears to be a base configuration for Vaadin UI tests

### Vaadin Frontend

**Development Mode:**
- Vaadin DevTools enabled via `spring-boot-devtools`
- Browser auto-launch enabled (`vaadin.launch-browser=true`)
- Frontend hot reload during development

**Production Mode:**
- Activated via `-Pproduction` profile
- Runs `prepare-frontend` and `build-frontend` goals
- Optimizes and bundles JavaScript/TypeScript resources
- Excludes `vaadin-dev` dependency

## Database Schema Management

When adding new tables or schema changes:

1. Create a new Flyway migration in `src/main/resources/db/migration/`
   - Follow naming convention: `V{version}__{description}.sql` (e.g., `V001__create_athletes_table.sql`)

2. Regenerate jOOQ classes:
   ```bash
   ./mvnw generate-sources
   ```

3. The plugin will:
   - Start a PostgreSQL Testcontainer
   - Apply all Flyway migrations
   - Generate type-safe jOOQ classes in `ch.martinelli.demo.aitaf.db`

## Package Structure

Base package: `ch.martinelli.demo.aitaf`

Currently minimal structure with:
- Main application class: `AiTrackAndFieldApplication`
- Test configuration: `TestcontainersConfiguration`, `TestAiTrackAndFieldApplication`
- Generated jOOQ code will appear in `ch.martinelli.demo.aitaf.db`

Typical structure for expansion would include:
- Domain models/entities
- Vaadin views/UI components
- Services for business logic
- Repositories using jOOQ DSLContext

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`):
- Runs on push, PR, and manual trigger
- Java 21 (AdoptOpenJDK distribution)
- Maven dependency caching
- Executes: `./mvnw -B test`