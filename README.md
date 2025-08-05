# 🚀 Smart Task Management

**Nền tảng quản lý dự án thông minh với AI, giúp team của bạn làm việc hiệu quả hơn.**

## 🎯 Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** NestJS, PostgreSQL, Prisma ORM
- **Auth:** JWT + Passport
- **Package Manager:** pnpm Workspaces

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- pnpm

### Setup

```bash
# Clone & install
git clone <repo-url>
cd smart-task-management
pnpm install

# Start database
docker-compose up -d postgres

# Setup environment
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local

# Setup database
pnpm --filter @smart-task-management/backend db:generate
pnpm --filter @smart-task-management/backend db:migrate

# Start development
pnpm dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api/docs

## 📁 Project Structure

```
smart-task-management/
├── apps/
│   ├── backend/          # NestJS API
│   └── frontend/         # Next.js App
├── packages/             # Shared packages
└── docker-compose.yml    # Database
```

## 🛠️ Development

```bash
# Start all services
pnpm dev

# Start individually
pnpm dev:frontend
pnpm dev:backend

# Build
pnpm build

# Lint
pnpm lint
```

## 📚 Documentation

- [Backend API](./apps/backend/README.md)
- [Frontend App](./apps/frontend/README.md)

## 🤝 Contributing

1. Fork & create feature branch
2. Follow coding standards
3. Add tests
4. Submit PR

---

**Made with ❤️ by Smart Task Team**