# API Модуль

## Обзор
API слой реализован через Next.js API Routes с защитой авторизации, rate limiting и CORS.

## Структура маршрутов

### `/api/chat` (POST)
**Назначение:** ИИ-консультация через текст или фото
**Аутентификация:** Обязательна
**Rate Limit:** 30 запросов/минуту

**Request Body:**
```typescript
{
  message: string;          // Сообщение пользователя (обязательно, max 2000 chars)
  image?: string;           // Base64 фото (опционально, max 5MB)
  history?: ChatMessage[];  // История (опционально, max 20 messages)
  sessionId?: string;       // ID сессии (опционально)
}
```

**Response:**
```typescript
{
  response: string;         // Ответ от ИИ
  history: ChatMessage[];   // Обновленная история
  sessionId: string;        // ID сессии
}

**Флоу:**
1. Проверка rate limit
2. CORS validation
3. Auth check (supabase.auth.getUser)
4. Input validation
5. Загрузка профиля пользователя из БД
6. Если есть image -> analyzeImage() -> upload to storage -> save to DB
7. Если текст -> createSession (если новая) -> generateRecommendation() -> save to DB

### `/api/analyze` (POST)
**Назначение:** Анализ фото кожи
**Аутентификация:** Обязательна
**Rate Limit:** 10 запросов/минуту

**Request:**
- Content-Type: multipart/form-data
- Поле: `image` (File)

**Ограничения:**
- Форматы: JPEG, PNG, WebP
- Размер: max 5MB

**Флоу:**
1. Rate limit check
2. Auth check
3. File validation (type, size)
4. Convert to base64
5. analyzeImage() с профилем пользователя
6. Upload to Supabase Storage
7. Save analysis to DB
8. Return analysis + imagePath

### `/api/analyze/[analysisId]` (DELETE)
**Назначение:** Удаление анализа с cleanup storage
**Аутентификация:** Обязательна

**Флоу:**
1. Auth check
2. Получение записи из БД (проверка ownership)
3. Если есть image_path -> удаление из storage
4. Удаление записи из БД

### `/api/chat/sessions` (GET)
**Назначение:** Получение списка сессий чата
**Аутентификация:** Обязательна

**Response:**
```typescript
{
  sessions: {
    id: string;
    title: string;
    created_at: string;
    chat_messages: { count: number }[];
  }[]
}
```

**Ограничения:** Последние 10 сессий

### `/api/chat/sessions/[sessionId]` (GET)
**Назначение:** Получение сообщений конкретной сессии
**Аутентификация:** Обязательна

**Response:**
```typescript
{
  session: { id: string; title: string };
  messages: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
  }[];
}
```

**Проверки:**
- Сессия должна принадлежать текущему пользователю

### `/api/disclaimer/accept` (POST)
**Назначение:** Принятие медицинского дисклеймера
**Аутентификация:** Обязательна

**Флоу:**
1. Auth check
2. Обновление profiles.disclaimer_accepted_at

## Защита

### Rate Limiting
- Реализовано через lib/rate-limit.ts
- In-memory Map с ключом по IP
- Автоматическая очистка каждые 5 минут
- Заголовки ответа: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset

### CORS
- Разрешенные origins: localhost:3000, NEXT_PUBLIC_SITE_URL
- Методы: GET, POST, PUT, DELETE, OPTIONS
- Заголовки: Content-Type, Authorization

### Auth Check Pattern
```typescript
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
}
```

## Обработка ошибок

### Retry Logic (AI Calls)
```typescript
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // exponential backoff
```

### Error Response Format
```typescript
{
  error: string;  // Пользовательское сообщение на русском
}
```

### Статусы
- 400: Bad Request (validation error)
- 401: Unauthorized
- 429: Too Many Requests (rate limit)
- 500: Internal Server Error

## Зависимости
- lib/rate-limit.ts
- lib/cors.ts
- lib/supabase/server.ts
- lib/ai/gemini.ts
- lib/user-profile.ts
