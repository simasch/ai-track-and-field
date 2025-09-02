# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Spring Boot application for managing track and field competitions, built with:
- Spring Boot 3.5.5
- Vaadin 24.8.7 (UI framework)
- jOOQ 3.20.6 (database access)
- PostgreSQL (database)
- Flyway (database migrations)
- Java 21

## Essential Commands

### Development
- **Run application**: `./mvnw spring-boot:test-run`
- **Run tests**: `./mvnw test`
- **Run specific test class**: `./mvnw test -Dtest=ClassName`
- **Run specific test method**: `./mvnw test -Dtest=ClassName#methodName`
- **Clean and build**: `./mvnw clean compile`
- **Generate jOOQ code**: `./mvnw generate-sources` (automatically runs with compile)

### Production Build
- **Build production package**: `./mvnw -Pproduction package`

## Architecture

### Database Layer
- Uses **jOOQ** for type-safe SQL queries with code generation from database schema
- Database migrations handled by **Flyway** (migrations should be placed in `src/main/resources/db/migration/`)
- jOOQ code is generated to `ch.martinelli.demo.aitaf.db` package from PostgreSQL schema
- Uses Testcontainers for automatic PostgreSQL setup during development and testing

### UI Layer
- Built with **Vaadin Flow** (server-side Java UI framework)
- Vaadin components are server-side rendered with automatic client-server communication
- Frontend resources in `src/main/frontend/` are managed by Vaadin

### Testing
- Uses **Testcontainers** for integration testing with real PostgreSQL
- **Karibu Testing** for Vaadin UI unit testing
- **Playwright** and **Mopo** for browser-based UI testing
