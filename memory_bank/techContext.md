# Tech Context

## Стек технологий
- **Runtime**: Bun
- **Framework**: Next.js 16.1.6
- **Язык**: TypeScript
- **База данных**: Supabase (PostgreSQL)
- **AI**: @google/generative-ai ^0.24.0, ai ^6.0.68
- **Аутентификация**: @supabase/ssr, @supabase/supabase-js
- **State Management**: zustand ^5.0.11, @tanstack/react-query ^5.90.20
- **UI**: 
  - Tailwind CSS 4
  - Radix UI (@radix-ui/react-*)
  - Framer Motion ^12.29.2
  - Lucide React ^0.563.0
- **Линтинг**: Biome ^1.9.4

## Ограничения
- OAuth для AI (Antigravity)
- Edge Functions для безопасного вызова API

## CI/CD
- Линтинг: `bun run lint` (Biome check)
- Форматирование: `bun run format` (Biome format)
- Исправление: `bun run lint:fix`