# Технический контекст

## Стек технологий

### Frontend
- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript 5
- **Runtime**: Bun
- **Styling**: Tailwind CSS v4, CSS Variables
- **UI Library**: Radix UI (shadcn/ui)
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Auth**: Supabase Auth (SSR)
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage (skin-photos bucket)
- **AI**: Google Gemini 3 Flash (ai-sdk-provider-gemini-cli)

### Infrastructure
- **Package Manager**: Bun
- **Linting**: Biome
- **Git**: GitHub
- **Deployment**: Vercel (предполагается)

## Структура проекта

```
app/
├── api/              # API Routes
│   ├── analyze/      # Фотоанализ (POST) и удаление (DELETE)
│   ├── chat/         # ИИ-чат (POST)
│   ├── chat/sessions/# История сессий
│   └── disclaimer/   # Принятие дисклеймера
├── auth/             # Аутентификация
├── consultation/     # Страница чата
├── dashboard/        # Главная страница
├── profile/          # Профиль пользователя
└── ...

components/
├── ui/               # UI компоненты (shadcn)
├── chat/             # Компоненты чата
├── profile/          # Компоненты профиля
└── nav/              # Навигация

lib/
├── ai/               # AI интеграция (Gemini)
├── store/            # Zustand stores
├── supabase/         # Supabase клиенты
├── rate-limit.ts     # Rate limiting utility
├── cors.ts           # CORS utilities
└── user-profile.ts   # Profile fetching
```

## API Endpoints

### POST /api/chat
Чат с ИИ-ассистентом
- Rate limit: 30 req/min
- Body: { message, image?, history?, sessionId? }
- Response: { response, history, sessionId }

### POST /api/analyze
Анализ фото кожи
- Rate limit: 10 req/min
- Body: FormData с image
- Response: { analysis, imagePath, analysisId }

### DELETE /api/analyze/[analysisId]
Удаление анализа с cleanup storage

### GET /api/chat/sessions
Список сессий чата (последние 10)

### GET /api/chat/sessions/[sessionId]
Сообщения конкретной сессии

## Таблицы БД (Supabase)

### profiles
- id (PK, UUID)
- name, age, skin_type, skin_problems[], allergies, goals[]
- disclaimer_accepted_at
- created_at, updated_at

### chat_sessions
- id (PK, UUID)
- user_id (FK)
- title
- created_at

### chat_messages
- id (PK, UUID)
- session_id (FK)
- role ('user' | 'assistant')
- content
- created_at

### photo_analyses
- id (PK, UUID)
- user_id (FK)
- image_path
- analysis_text
- created_at

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# Или NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
```

## Ограничения
- Gemini OAuth требует подписки
- Rate limiting in-memory (не Redis)
- Фото хранятся в Supabase Storage (5MB limit)
- TypeScript типы Supabase могут отличаться от реальной схемы БД

## CI/CD
Текущая конфигурация не обнаружена. Для production рекомендуется:
- GitHub Actions для lint/test/build
- Vercel для деплоя
- Supabase CLI для миграций
