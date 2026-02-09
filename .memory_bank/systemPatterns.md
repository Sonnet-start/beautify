# Системные паттерны

## Архитектура

### Frontend Architecture
**App Router (Next.js 14+)**
- Server Components по умолчанию
- Client Components только при необходимости ("use client")
- Async Server Components для загрузки данных

### State Management
**Zustand Stores**:
- `chat-store.ts` - Состояние чата, сообщения, история
- `profile-store.ts` - Состояние визарда профиля
- `ui-store.ts` - UI состояние (тема, модалки)

### Data Fetching Pattern
1. **Server Components**: Используют `createClient()` из `@/lib/supabase/server` для SSR данных
2. **Client Components**: Используют `createClient()` из `@/lib/supabase/client` и TanStack Query
3. **API Routes**: Server-side обработка с авторизацией

### Authentication Flow
```
1. Middleware (middleware.ts) -> updateSession
2. Server Component -> createClient() -> getUser()
3. Если нет user -> redirect('/auth/login')
```

## Связи подсистем

### Чат-система
```
ConsultationPage (Client)
├── ChatInput (загрузка фото + текст)
├── MessageBubble (отображение сообщений)
├── useChatStore (состояние)
└── /api/chat (POST)
    ├── Rate limiting
    ├── CORS validation
    ├── Auth check
    ├── getUserProfile() из БД
    ├── generateRecommendation() с retry
    └── Save to DB
```

### Фотоанализ
```
AnalysisPage (Client)
├── ImageUpload (drag & drop)
├── AnalysisResult (отображение)
└── /api/analyze (POST)
    ├── Rate limiting
    ├── Auth check
    ├── getUserProfile() из БД
    ├── analyzeImage() с retry
    ├── Upload to Storage
    └── Save to DB
```

### Профиль
```
ProfilePage (Server)
├── loadProfile() из БД
└── ProfileClient (Client)
    ├── ProfileWizard (6 шагов)
    ├── ProfileForm (редактирование)
    └── Save to DB
```

## Ключевые паттерны

### Rate Limiting
```typescript
const rateLimit = createRateLimit({
  windowMs: 60 * 1000,
  maxRequests: 30,
});
```
In-memory Map с автоматической очисткой (5 минут).

### CORS
```typescript
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  process.env.NEXT_PUBLIC_SITE_URL || "",
];
```

### Error Handling
- **Retry Logic**: 3 попытки с exponential backoff (1s, 2s, 4s)
- **Graceful Degradation**: Продолжаем работу даже если upload в storage fails
- **User-friendly errors**: Сообщения на русском языке

### Security Patterns
1. **Auth Check**: Всегда проверяем `supabase.auth.getUser()` в API routes
2. **User Isolation**: Все запросы к БД фильтруются по `user_id`
3. **Input Validation**: Проверка длины сообщений, размера и типа файлов
4. **CORS**: Проверка origin на всех API endpoints

### Data Flow
```
User Input -> Validation -> Auth Check -> Rate Limit -> 
-> Business Logic -> DB/Storage -> Response
```

## Известные проблемы архитектуры

1. **Type Safety**: Supabase типы не полностью синхронизированы (используем @ts-expect-error)
2. **Rate Limiting**: In-memory (при перезапуске сервера счетчики сбрасываются)
3. **PHI Data**: Фото кожи хранятся без client-side encryption
4. **No Caching**: Нет кэширования профилей (каждый запрос = запрос в БД)

## Рекомендации по масштабированию

1. **Redis**: Для rate limiting в production
2. **CDN**: Для статических assets и изображений
3. **Edge Functions**: Для AI обработки (ближе к пользователю)
4. **Caching**: TanStack Query для клиентского кэширования
