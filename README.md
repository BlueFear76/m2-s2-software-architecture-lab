# Medium-like API

## Project Description

This project is a **Medium-like REST API** built with **NestJS**. It allows users to create and manage blog posts, review content through a moderation workflow, comment on articles, follow authors, and receive notifications about important events.

**Architecture**: Clean Architecture + DDD + Event-Driven (domain events → notifications)

Main features include:

- Post management with moderation workflow (`DRAFT → PENDING_REVIEW → ACCEPTED / REJECTED`)
- Tag system for categorizing posts
- Slug-based URLs for posts
- Comments on published posts
- User subscriptions (follow authors)
- Notification system based on domain events


## Prerequisites

Make sure you have the following installed:

- Node.js >= 18
- npm
- Git


## Installation

### 1. Install dependencies

```bash
$ npm install
```

## 2. SQLite database
SQLite database is created automatically on startup

## 3. Generate seed data

Run seed BEFORE starting the API to have test data!

```bash
npm install uuid @types/uuid sqlite3 @types/sqlite3
npm run seed
```
Creates: 3 users, 5 tags, 3 posts, comments, subscriptions, notifications


## 4. Environment Variables

```bash
PORT=3000
DATABASE_PATH=./database.sqlite
JWT_SECRET=supersecret
```
# Description :

- PORT – Port used by the API
- DATABASE_PATH – Path to the SQLite database
- JWT_SECRET – Secret used for authentication tokens


## 5. Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 6. Run tests

Tests the complete business flow: Users → Posts → Permissions → Moderation → Events → Notifications

# 1. Generate test data
npm run seed

# 2. Run E2E tests
npm run test:e2e

# What the E2E Tests Cover (5 tests)

| Test                 | Description                                | Coverage                      |
| -------------------- | ------------------------------------------ | ----------------------------- |
| Seed data            | Verifies DB contains seed data             | Database + Entities           |
| Writer create        | Writer can create post with tags           | Permissions + CRUD            |
| Reader 403           | Reader rejected (no permission)            | RBAC + Exceptions             |
| Admin approve        | Admin successfully moderates post          | Moderation Workflow           |
| Writer notifications | Writer receives post approval notification | Domain Events + Notifications |




## API Documentation

Swagger documentation is available at:

```bash
http://localhost:3000/api
```
# It includes documentation for:
- Users
- Posts
- Tags
- Comments
- Subscriptions
- Notifications

