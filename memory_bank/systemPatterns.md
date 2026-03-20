# System Patterns

## Архитектура
- **Тип**: Fullstack Web Application (Next.js App Router)
- **Паттерн**: Server Components + Client Components
- **BaaS**: Supabase

## Основные модули
1. **Auth Module** - Аутентификация через Supabase Auth
2. **Profile Module** - Управление профилем и данными о коже
3. **AI Module** - Интеграция с Google Gemini для консультаций
4. **Analysis Module** - Анализ фото кожи
5. **Calendar Module** - Планирование процедур

## Связи между модулями
- Profile -> AI Module (передача данных о коже)
- Auth -> Profile (защита доступа)
- AI Module -> Supabase Storage (сохранение истории)
- Calendar -> Notifications (напоминания)