# Дополнительные заметки

## Legacy и технический долг

### Известные проблемы типизации
1. **Supabase Types** (`lib/supabase/database.types.ts`)
   - Типы сгенерированы, но не полностью синхронизированы с реальной схемой БД
   - Вызывают ошибки TypeScript при использовании `.insert()` и `.select()`
   - **Решение:** Использовать `@ts-expect-error` или обновить типы через Supabase CLI

2. **Cookie Types** (`lib/supabase/middleware.ts`)
   - Проблема с типизацией параметров cookies.set()
   - **Статус:** Не критично, код работает

### Временные решения

#### @ts-expect-error usage
Наши файлы используют `@ts-expect-error` для подавления ошибок TypeScript от Supabase:
- `app/api/chat/route.ts` - 3 использования
- `app/api/analyze/route.ts` - 2 использования  
- `app/api/analyze/[analysisId]/route.ts` - 2 использования

**Рекомендация:** Перегенерировать типы Supabase:
```bash
npx supabase gen types typescript --project-id gtdylikhsujjpczlgodd --schema public > lib/supabase/database.types.ts
```

### Неопределенности

#### Database Schema
- Неизвестно точное состояние RLS (Row Level Security) политик
- Неясно, настроены ли триггеры для автоматического создания профиля при регистрации

#### Environment
- Неизвестно, настроены ли все необходимые env vars на production
- NEXT_PUBLIC_SITE_URL не определен (CORS может не работать на prod)

### Рекомендации по рефакторингу

1. **Типы Supabase:**
   - Перегенерировать и исправить все @ts-expect-error
   - Добавить строгую типизацию для всех запросов

2. **Error Handling:**
   - Создать централизованный error handler
   - Добавить Sentry для отслеживания ошибок

3. **Testing:**
   - Добавить тесты для API routes
   - Добавить тесты для компонентов
   - Добавить E2E тесты

4. **Monitoring:**
   - Настроить логирование (Winston/Pino)
   - Добавить метрики (Prometheus)
   - Настроить алерты

## Ссылки и ресурсы

### Документация
- `docs/PRD.md` - Product Requirements Document
- `docs/QandA.md` - Вопросы и ответы
- `docs/GITHUB_OAUTH_SETUP.md` - Инструкция по настройке GitHub OAuth

### Внешние сервисы
- **Supabase Dashboard:** https://supabase.com/dashboard/project/gtdylikhsujjpczlgodd
- **GitHub Repo:** https://github.com/Sonnet-start/beautify

### Полезные команды
```bash
# Локальная разработка
bun dev

# Линтинг
bun run lint

# Форматирование
bun run format

# Сборка
bun run build

# Supabase (если установлен CLI)
supabase db pull
supabase db push
supabase gen types typescript
```

## Контакты и ответственные
- Разработчик: (не указано)
- Проект: Мой личный косметолог (Beautify)
- Дата создания Memory Bank: 2026-02-09
