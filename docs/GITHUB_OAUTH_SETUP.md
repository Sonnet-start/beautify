# Настройка GitHub OAuth для Supabase

## Шаг 1: Создание OAuth App в GitHub

1. Перейдите в **GitHub Settings** → **Developer settings** → **OAuth Apps**
   - Прямая ссылка: https://github.com/settings/developers

2. Нажмите **"New OAuth App"**

3. Заполните форму:
   - **Application name**: `Мой личный косметолог` (или любое название)
   - **Homepage URL**: `http://localhost:3000` (для разработки)
   - **Authorization callback URL**: 
     ```
     https://gtdylikhsujjpczlgodd.supabase.co/auth/v1/callback
     ```

4. Нажмите **"Register application"**

5. На следующей странице:
   - Скопируйте **Client ID**
   - Нажмите **"Generate a new client secret"** 
   - Скопируйте **Client secret** (сохраните его — он показывается только один раз!)

---

## Шаг 2: Настройка GitHub Provider в Supabase

1. Откройте Supabase Dashboard:
   https://supabase.com/dashboard/project/gtdylikhsujjpczlgodd/auth/providers

2. Найдите **GitHub** в списке провайдеров

3. Включите провайдер (toggle)

4. Вставьте:
   - **Client ID** — из GitHub OAuth App
   - **Client Secret** — из GitHub OAuth App

5. Нажмите **"Save"**

---

## Шаг 3: Настройка Redirect URLs в Supabase

1. Перейдите в:
   https://supabase.com/dashboard/project/gtdylikhsujjpczlgodd/auth/url-configuration

2. Добавьте в **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   ```

3. Для продакшена также добавьте:
   ```
   https://your-production-domain.com/auth/callback
   ```

---

## Шаг 4: Проверка

1. Перезапустите dev сервер:
   ```powershell
   bun run dev
   ```

2. Перейдите на `/auth/login`

3. Нажмите **"Войти через GitHub"**

4. Вы должны быть перенаправлены на GitHub для авторизации

---

## Готово! 🎉

После успешной авторизации через GitHub вы будете перенаправлены на `/dashboard`.
