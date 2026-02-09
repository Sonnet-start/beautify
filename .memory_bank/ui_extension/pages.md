# UI: Страницы

## Главная страница (HomePage)
**Путь:** `app/page.tsx`
**Тип:** Server Component (async)

**Описание:**
Лендинг с предложением зарегистрироваться. Если пользователь авторизован - редирект на /dashboard.

**Компоненты:**
- Background decoration (градиентные шары)
- Header с логотипом и кнопками входа/регистрации
- Hero section с CTA

**Данные:**
- Проверка авторизации через supabase.auth.getUser()

---

## Дашборд (DashboardPage)
**Путь:** `app/dashboard/page.tsx`
**Тип:** Server Component (async)

**Описание:**
Главная страница для авторизованных пользователей с карточками функций.

**Компоненты:**
- AppNavbar (brand variant)
- FeatureCard (4 карточки: ИИ-Консультация, Анализ фото, Календарь ухода, Мой профиль)
- Background decoration

**Данные:**
- displayName из user.user_metadata или user.email
- Редирект на /auth/login если нет авторизации

**Особенности:**
- Карточки ИИ-Консультация и Анализ фото требуют принятия дисклеймера

---

## Консультация (ConsultationPage)
**Путь:** `app/consultation/page.tsx`
**Тип:** Client Component ("use client")

**Описание:**
Интерфейс чата с ИИ-ассистентом.

**Компоненты:**
- AppNavbar (page variant)
- ChatInput (текст + загрузка фото)
- MessageBubble (отображение сообщений)
- TypingIndicator
- История сессий (grid layout)
- Предложенные вопросы

**Состояние (Zustand):**
- messages: Message[]
- history: ConversationHistory[]
- isLoading: boolean
- error: string | null
- sessionId: string | null

**Данные:**
- История сессий: GET /api/chat/sessions
- Загрузка сессии: GET /api/chat/sessions/[sessionId]
- Отправка сообщения: POST /api/chat

**UX Flow:**
1. Пустое состояние: приветствие + предложенные вопросы + история
2. После отправки: отображение сообщений в чат-формате
3. Auto-scroll к новым сообщениям

---

## Анализ фото (AnalysisPage)
**Путь:** `app/analysis/page.tsx`
**Тип:** Client Component

**Описание:**
Страница загрузки и анализа фото кожи.

**Компоненты:**
- AppNavbar
- ImageUpload (drag & drop)
- AnalysisResult (отображение результата)
- История анализов

**API:**
- POST /api/analyze
- GET /api/analyze/history
- DELETE /api/analyze/[analysisId]

---

## Профиль (ProfilePage)
**Путь:** `app/profile/page.tsx`
**Тип:** Server Component + ProfileClient

**Описание:**
Управление профилем пользователя.

**Состояния:**
1. **Нет профиля:** Показывается ProfileWizard (6 шагов)
2. **Есть профиль:** Показывается форма редактирования
3. **Wizard mode:** Повторное заполнение анкеты

**Компоненты:**
- AppNavbar
- ProfileWizard (6 steps: Welcome, Age, Skin Type, Problems, Goals, Summary)
- Profile form (Input, Select, Checkbox, Textarea)
- Cards с glass эффектом

**Данные:**
- Загрузка: Server-side из БД
- Сохранение: Client-side через Supabase

**Поля профиля:**
- name (string)
- age (string)
- skinType (select)
- problems (checkboxes + custom)
- allergies (textarea)
- goals (buttons + custom)

---

## Календарь (CalendarPage)
**Путь:** `app/calendar/page.tsx`

**Описание:**
Placeholder для будущего функционала календаря ухода.

---

## Аутентификация

### Вход (LoginPage)
**Путь:** `app/auth/login/page.tsx`
**Тип:** Client Component

**Функционал:**
- Email + Password
- Google OAuth
- GitHub OAuth
- Ссылка "Забыли пароль?"
- Ссылка на регистрацию

### Регистрация (SignupPage)
**Путь:** `app/auth/signup/page.tsx`
**Тип:** Client Component

**Функционал:**
- Email + Password + Confirm Password
- Google OAuth
- GitHub OAuth
- Ссылка на вход

### Подтверждение email (VerifyPage)
**Путь:** `app/auth/verify/page.tsx`

**Описание:**
Страница с сообщением о отправке письма подтверждения.

## Общие паттерны страниц

### Layout
Все страницы используют:
- RootLayout с ThemeProvider, QueryProvider, DisclaimerProvider
- Background decoration (динамические градиенты)
- AppNavbar (варианты: brand, page)

### Защита роутов
- Server Components: проверка auth -> redirect
- Client Components: middleware + проверка на уровне API

### Loading States
- Server: async components с suspense
- Client: локальные isLoading состояния

### Error Handling
- Server: redirect на страницу ошибки или login
- Client: toast/alert сообщения
