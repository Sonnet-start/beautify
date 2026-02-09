# UI: Компоненты

## Навигация

### AppNavbar
**Путь:** `components/nav/app-navbar.tsx`
**Тип:** Client Component

**Варианты:**
- `variant="brand"` - Главная страница/дашборд
- `variant="page"` - Внутренние страницы (с кнопкой назад)

**Props:**
```typescript
{
  variant: 'brand' | 'page';
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  backHref?: string;
  userName?: string;
}
```

**Функционал:**
- Отображение логотипа
- Название страницы (для page variant)
- UserMenu (dropdown с профилем и выходом)
- ThemeToggle
- Кнопка "Назад" (для page variant)

### UserMenu
**Путь:** `components/nav/user-menu.tsx`
**Тип:** Client Component

**Функционал:**
- Отображение имени/аватара
- Dropdown: Профиль, Выход
- Server Action для logout (чистка кук)

### ThemeToggle
**Путь:** `components/nav/theme-toggle.tsx`

**Функционал:**
- Переключение темы (светлая/темная)
- Иконки Sun/Moon

---

## Компоненты чата

### ChatInput
**Путь:** `components/chat/chat-input.tsx`
**Тип:** Client Component

**Функционал:**
- Textarea для ввода сообщения
- Кнопка прикрепления фото
- Drag & drop для изображений
- Preview загруженного фото
- Submit по Enter (Shift+Enter для новой строки)
- Отправка на Enter

**Props:**
```typescript
{
  onSubmit: (message: string, image?: string) => void;
  disabled?: boolean;
}
```

### MessageBubble
**Путь:** `components/chat/message-bubble.tsx`
**Тип:** Client Component

**Варианты:**
- User message (справа, primary цвет)
- Assistant message (слева, muted цвет)

**Функционал:**
- Отображение текста
- Отображение изображений (если есть)
- Markdown rendering (react-markdown)
- Framer Motion анимации (staggered)

### TypingIndicator
**Путь:** `components/chat/message-bubble.tsx`

**Функционал:**
- Анимированные точки
- Показывается во время ожидания ответа

---

## Компоненты профиля

### ProfileWizard
**Путь:** `components/profile/profile-wizard.tsx`
**Тип:** Client Component

**Функционал:**
- 6-шаговый визард с прогресс-баром
- Навигация Вперед/Назад
- Валидация обязательных полей
- Сохранение в Supabase по завершению

**Шаги:**
1. WelcomeStep - Приветствие
2. AgeStep - Ввод возраста
3. SkinTypeStep - Выбор типа кожи
4. ProblemsStep - Проблемы кожи (checkboxes)
5. GoalsStep - Цели ухода (buttons)
6. SummaryStep - Подтверждение

### Шаги визарда
**Путь:** `components/profile/steps/*.tsx`

- **AgeStep:** Input + валидация
- **SkinTypeStep:** Radio cards
- **ProblemsStep:** Checkbox grid + custom input
- **GoalsStep:** Toggle buttons + custom input
- **SummaryStep:** Review всех данных + Submit

---

## UI Компоненты (shadcn/ui)

### Button
**Варианты:** default, secondary, ghost, outline, gradient
**Размеры:** default, sm, lg, xl

### Card
**Props:** glass (кастомный проп для glassmorphism)

### Input
Базовый input с label и validation states.

### Textarea
Многострочный ввод с auto-resize.

### Select
Dropdown select с trigger и content.

### Checkbox
Checkbox с label.

### Dialog
Модальное окно.

### DisclaimerModal
**Путь:** `components/ui/disclaimer-modal.tsx`

**Функционал:**
- Показывается перед первым использованием чата/анализа
- Медицинский дисклеймер
- Кнопки "Принять" / "Отклонить"
- Сохранение в БД при принятии

---

## Компоненты дашборда

### FeatureCard
**Путь:** `components/dashboard/feature-card.tsx`

**Props:**
```typescript
{
  iconName: string;          // Иконка из lucide-react
  title: string;
  description: string;
  href: string;
  available: boolean;
  requiresDisclaimer: boolean;
}
```

**Функционал:**
- Иконка + заголовок + описание
- Ссылка на функцию
- Проверка дисклеймера (если requiresDisclaimer)
- Состояние disabled (если !available)

---

## Провайдеры

### ThemeProvider
**Путь:** `components/providers/theme-provider.tsx`

Управление темой (светлая/темная/системная).

### QueryProvider
**Путь:** `components/providers/query-provider.tsx`

TanStack Query Provider для кэширования данных.

### DisclaimerProvider
**Путь:** `components/providers/disclaimer-provider.tsx`

Проверка принятия дисклеймера и показ модалки если нужно.

---

## Дизайн-система

### Цвета
- Primary: Основной акцентный цвет
- Accent: Вторичный акцент
- Background: Фон
- Foreground: Текст
- Muted: Вторичный текст
- Border: Границы

### Glassmorphism
```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### Анимации
- **Page transitions:** Framer Motion (initial, animate, exit)
- **Stagger:** Задержка между элементами
- **Background:** CSS анимация pulse для градиентов

### Типографика
- **Заголовки:** Prata (serif)
- **Основной текст:** IBM Plex Sans (sans-serif)
