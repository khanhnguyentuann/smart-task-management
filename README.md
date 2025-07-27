# 🎯 Smart Task Management System

A full-stack task management system with AI-powered features, built with modern technologies.

## 🏗️ Project Structure (Mono Repo)

```
smart-task-management/
├── apps/
│   ├── frontend/          # Next.js React app
│   └── backend/           # NestJS API server
├── packages/
│   └── types/            # Shared TypeScript types
├── package.json          # Root workspace config
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- PostgreSQL
- yarn (recommended package manager)

### Development

Run all apps in development mode:
```bash
yarn dev
```

Or run individually:
```bash
# Frontend only
yarn dev:frontend

# Backend only (coming soon)
yarn dev:backend
```

### Build
```bash
yarn build
```

## 🧱 Tech Stack

### Backend (Coming Soon)
- 🧠 Language: TypeScript
- ⚙️ Framework: NestJS
- 🗄️ Database: PostgreSQL + Prisma
- 🔐 Auth: JWT + Refresh Token
- 🤖 AI: OpenAI API integration

### Frontend
- ⚛️ Framework: Next.js (React)
- 🧠 Language: TypeScript
- 💅 UI: Tailwind CSS + shadcn/ui
- 🌐 State Management: TanStack Query

## 📝 Development Progress

- [x] Setup mono repo structure
- [ ] Backend NestJS setup
- [ ] Authentication system
- [ ] Project management
- [ ] Task management
- [ ] AI integration
- [ ] Docker deployment

---

This project follows the milestone-based development approach with systematic commits for each feature.