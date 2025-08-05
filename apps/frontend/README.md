# Smart Task Management - Frontend

Frontend application for Smart Task Management built with Next.js 15, TypeScript, and Tailwind CSS, organized using Feature-Based Architecture.

## 🏗️ Architecture

This project follows a **Feature-Based Architecture** pattern, organizing code by business features rather than technical layers.

### Directory Structure

```
src/
├── app/                      # Next.js app directory (minimal, just routing)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── features/                 # Feature modules
│   ├── auth/                 # Authentication feature
│   │   ├── components/       # Auth-specific components
│   │   ├── hooks/           # Auth-specific hooks
│   │   ├── services/        # Auth API services
│   │   ├── stores/          # Auth state management
│   │   └── types/           # Auth type definitions
│   │
│   ├── dashboard/           # Dashboard feature
│   ├── projects/            # Projects management
│   ├── tasks/               # Tasks management
│   ├── user/                # User profile & settings
│   ├── settings/            # Application settings
│   ├── notifications/       # Notifications system
│   └── help/                # Help & support
│
├── shared/                   # Shared/Common modules
│   ├── components/          # Reusable components
│   │   ├── ui/             # Design system components
│   │   ├── layout/         # Layout components
│   │   ├── animations/     # Animation components
│   │   └── interactive/    # Interactive components
│   ├── hooks/              # Shared hooks
│   ├── lib/                # Utility libraries
│   ├── services/           # Shared services
│   └── types/              # Global type definitions
│
└── core/                    # Core business logic
    ├── constants/          # Application constants
    └── utils/              # Core utilities
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

## 🎨 Design System

The application uses a comprehensive design system built with:

- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **Framer Motion** - Smooth animations

### UI Components

All UI components are located in `src/shared/components/ui/` and follow a consistent API pattern:

```tsx
import { Button } from "@/shared/components/ui/button"

<Button variant="default" size="lg">
  Click me
</Button>
```

## 🔧 Development Guidelines

### Feature Development

1. **Create a new feature**: Add a new directory under `src/features/`
2. **Organize by concern**: Each feature should have `components/`, `hooks/`, `services/`, `types/`
3. **Keep features isolated**: Features should not import from each other directly
4. **Use shared components**: Reuse components from `src/shared/`

### Code Organization

- **Components**: Use PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: Use camelCase starting with 'use' (e.g., `useAuth.ts`)
- **Services**: Use camelCase (e.g., `authService.ts`)
- **Types**: Use PascalCase with suffix (e.g., `UserType`, `AuthProps`)

### State Management

- **Local state**: Use React hooks (`useState`, `useReducer`)
- **Shared state**: Use custom hooks or context
- **Server state**: Use services with proper error handling

### API Integration

All API calls are centralized in feature services:

```tsx
// src/features/auth/services/authService.ts
export class AuthService {
  async login(email: string, password: string) {
    // API implementation
  }
}
```

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 📦 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking

## 🔗 Integration

This frontend is designed to work with the Smart Task Management backend API. Make sure the backend is running on the configured port (default: 3001).

## 📝 Contributing

1. Follow the Feature-Based Architecture pattern
2. Write clean, maintainable code
3. Add proper TypeScript types
4. Include error handling
5. Test your changes

## 📄 License

This project is part of the Smart Task Management system. 