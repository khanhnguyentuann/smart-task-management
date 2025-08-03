# 🚀 Smart Task Management - Backend API

**NestJS REST API cho hệ thống quản lý dự án thông minh**

## 🎯 Tech Stack

- **Framework:** NestJS 11.x
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT + Passport
- **Validation:** Class-validator + Joi
- **Testing:** Jest

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Yarn

### Setup

```bash
# Install dependencies
cd apps/backend
yarn install

# Setup environment
cp .env.example .env

# Setup database
yarn db:generate
yarn db:migrate

# Start development
yarn start:dev
```

**Access:**
- API: http://localhost:3001
- Docs: http://localhost:3001/api/docs
- Health: http://localhost:3001/health

## 📁 Structure

```
src/
├── auth/               # Authentication
├── users/              # User management
├── projects/           # Project management
├── tasks/              # Task management
├── common/             # Shared utilities
├── config/             # Configuration
└── database/           # Database setup
```

## 🛠️ Development

```bash
# Development
yarn start:dev          # Start dev server
yarn start:debug        # Start with debug
yarn build              # Build production

# Database
yarn db:generate        # Generate Prisma client
yarn db:migrate         # Run migrations
yarn db:studio          # Open Prisma Studio
yarn db:seed            # Seed database

# Testing
yarn test               # Run tests
yarn test:watch         # Watch mode
yarn test:e2e           # E2E tests
```

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/smart_task_management"

# JWT
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"

# App
PORT=3001
NODE_ENV=development
```

## 📚 API Endpoints

### Auth
- `POST /auth/register` - Đăng ký
- `POST /auth/login` - Đăng nhập
- `POST /auth/refresh` - Refresh token

### Users
- `GET /users/me` - Profile hiện tại
- `PUT /users/me` - Cập nhật profile

### Projects
- `GET /projects` - Danh sách dự án
- `POST /projects` - Tạo dự án
- `GET /projects/:id` - Chi tiết dự án

### Tasks
- `GET /projects/:id/tasks` - Tasks của dự án
- `POST /projects/:id/tasks` - Tạo task
- `PUT /tasks/:id` - Cập nhật task

## 🚀 Deployment

```bash
# Build
yarn build

# Start production
yarn start:prod
```

---

**Backend API - Smart Task Management System** 