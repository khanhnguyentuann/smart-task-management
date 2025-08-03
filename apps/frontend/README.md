# 🚀 Smart Task Management - Frontend

**Next.js Web Application cho hệ thống quản lý dự án thông minh**

## 🎯 Tech Stack

- **Framework:** Next.js 14 (React 18)
- **Styling:** Tailwind CSS + Radix UI
- **State:** React Query + Context API
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Yarn
- Backend API running

### Setup

```bash
# Install dependencies
cd apps/frontend
yarn install

# Setup environment
cp .env.example .env.local

# Start development
yarn dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001 (required)

## 📁 Structure

```
src/
├── app/                # Next.js App Router pages
├── components/         # Reusable UI components
│   ├── auth/          # Authentication components
│   ├── common/        # Common components
│   ├── layout/        # Layout components
│   ├── projects/      # Project components
│   └── ui/            # Base UI components
├── constants/          # Application constants
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── schemas/            # Zod validation schemas
├── services/           # API services
├── types/              # TypeScript types
└── utils/              # Utility functions
```

## 🛠️ Development

```bash
# Development
yarn dev              # Start dev server
yarn build            # Build production
yarn start            # Start production
yarn lint             # Run ESLint

# Type checking
yarn type-check       # Check TypeScript types
```

## 🔧 Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3001"

# App Configuration
NEXT_PUBLIC_APP_NAME="Smart Task Management"
NEXT_PUBLIC_APP_VERSION="0.1.0"
```

## 📚 Key Components

### Auth Components
- `AuthLayout` - Layout cho auth pages
- `LoginForm` - Form đăng nhập
- `RegisterForm` - Form đăng ký
- `QuickLogin` - Quick login với mock users

### Common Components
- `AppLogo` - Logo component với variants
- `AppAvatar` - Avatar component với variants
- `Pagination` - Pagination component
- `SearchInput` - Search input với debounce

### Layout Components
- `AppSidebar` - Main sidebar navigation
- `DashboardLayout` - Dashboard layout wrapper
- `UserMenu` - User dropdown menu

## 🚀 Deployment

```bash
# Build
yarn build

# Start production
yarn start
```

---

**Frontend Application - Smart Task Management System** 