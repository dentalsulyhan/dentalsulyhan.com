# Розгортання на VPS (Docker + Caddy + PostgreSQL)

Стек: `postgres` (17) · `app` (Next.js + Payload, один контейнер) · `caddy` (HTTPS) · `backup` (щоденний шифрований pg_dump) · `migrate` (разова задача).
Назовні відкриті лише порти 80/443 (Caddy). PostgreSQL і застосунок доступні тільки всередині Docker-мережі.

## 1. Підготовка

1. На VPS: Docker Engine + Docker Compose v2.
2. `cd deploy && cp .env.example .env` і заповнити всі значення.
   - `POSTGRES_PASSWORD`: тільки літери й цифри (пароль потрапляє в URL).
   - `PAYLOAD_SECRET`: той самий, що на Vercel (інакше розлогінить поточні сесії адмінів).
   - `BACKUP_PASSPHRASE`: **збережіть копію поза сервером**. Без неї бекапи не відновити.
3. Cloudflare: режим SSL/TLS `Full (strict)`. Caddy сам випустить сертифікат Let's Encrypt.
4. Turnstile: у налаштуваннях віджета додати домен.

## 2. Перше розгортання

```bash
cd deploy
docker compose build                    # збирає app і backup (migrate збирається при першому запуску)
docker compose up -d postgres           # порожня БД
# далі розділ 3 (копіювання бази) і розділ 4 (міграції)
docker compose up -d                    # app + caddy + backup
docker compose ps                       # app має бути healthy
curl -fsS http://127.0.0.1:3000/api/health || docker compose exec app wget -qO- http://127.0.0.1:3000/api/health
```

## 3. Копіювання бази з Supabase (безпечно для бойових даних)

Скрипт [`scripts/db-copy.sh`](scripts/db-copy.sh):

- **джерело лише читається** (`pg_dump` і `SELECT count`), у Supabase нічого не пишеться;
- **ціль має бути порожньою**: якщо в ній є хоч одна таблиця, скрипт відмовляється працювати;
- відмовляється, якщо ціль схожа на Supabase або збігається з джерелом;
- видаляє службовий рядок `dev` (batch −1) з `payload_migrations` **тільки на цілі** (інакше `payload migrate` зависає на питанні y/N);
- після відновлення порівнює кількість рядків у кожній таблиці;
- файл дампу (містить персональні дані) видаляється при будь-якому завершенні, окрім `KEEP_DUMP=1`.

```bash
# для SOURCE_URL беріть пряме підключення або session pooler (порт 5432), НЕ transaction pooler (6543)
SOURCE_URL='postgresql://postgres.xxxx:***@aws-0-eu-west-1.pooler.supabase.com:5432/postgres' \
TARGET_URL='postgres://sulyhan:***@127.0.0.1:5432/sulyhan' \
  deploy/scripts/db-copy.sh
```

Postgres у compose не публікує порт. Для запуску з хоста виконайте скрипт у тимчасовому контейнері в мережі compose
(`docker compose run --rm --entrypoint bash ...`) або тимчасово додайте `ports: ['127.0.0.1:5432:5432']` і приберіть після копіювання.

Якщо відновлення впало на півдорозі: видаліть і створіть нову порожню цільову базу, потім повторіть.

> Міграції **не можна** прогнати на порожній базі: частину таблиць (наприклад `team_members`, усі `services_blocks_*`) створив dev-режим Payload, а не міграції. Тому база переноситься дампом.

## 4. Міграції

```bash
docker compose --profile tools run --rm migrate
```

Запускайте **перед** `docker compose up -d` кожного разу, коли в релізі є нові файли в `src/migrations`.
Контейнер `app` міграцій не виконує. Якщо вивід містить питання «dev mode … data loss» і процес чекає, значить у `payload_migrations` лишився рядок `batch = -1`: скрипт з розділу 3 його прибирає. Не відповідайте «y» на бойовій базі, не прочитавши, які міграції очікують.

## 5. Оновлення

```bash
git pull
cd deploy
docker compose build
docker compose --profile tools run --rm migrate    # якщо є нові міграції
docker compose up -d
```

Відкат: `git checkout <попередній коміт>`, `docker compose build`, `docker compose up -d`. Міграції не відкочуються автоматично. Нові таблиці й колонки в проєкті лише додаються (`IF NOT EXISTS`), тому старий код працює з новою схемою.

## 6. Бекапи

- Щодня о `BACKUP_HOUR_UTC` (за замовчуванням 03:00 UTC) створюється `sulyhan-<час>.dump.enc` у томі `backups`, зберігається `BACKUP_KEEP_DAYS` днів.
- Якщо задано `BACKUP_S3_BUCKET`, копія вантажиться в **окремий** R2-бакет (не в бакет із медіа). Строк зберігання там задайте lifecycle-правилом бакета.
- Ручний запуск: `docker compose run --rm -e BACKUP_MODE=once backup`.
- Відновлення в **порожню** базу:

```bash
openssl enc -d -aes-256-cbc -pbkdf2 -pass env:BACKUP_PASSPHRASE -in sulyhan-XXXX.dump.enc -out restore.dump
pg_restore --no-owner --no-acl -d "<URL порожньої бази>" restore.dump
```

**Перевірте відновлення на тестовій базі до запуску в роботу.** Бекап, який не відновлювали, бекапом не вважається.

## 7. План перемикання (cutover)

Дамп це знімок. Усе, що змінять в адмінці Vercel/Supabase після нього, на VPS не потрапить.

1. Заздалегідь: розгорнути VPS на тестовому піддомені, перевірити сайт, форму, адмінку, завантаження медіа.
2. За добу: зменшити TTL DNS-запису в Cloudflare.
3. Домовитися про «заморозку» редагування в адмінці на час перемикання.
4. Свіжий дамп: порожня нова база → `db-copy.sh` → `migrate` → `up -d`.
5. Перевірити сайт напряму (через `hosts` або піддомен).
6. Перемкнути DNS на VPS. Vercel/Supabase не вимикати кілька днів як запасний варіант.
7. Заявки з форми, що надійшли на старий сайт між дампом і перемиканням, треба перенести вручну (таблиця `contact_submissions`).

## 8. Обмеження, які варто знати

- **Один екземпляр застосунку.** Кеш (`unstable_cache`, ISR) живе у томі `next-cache` на одному контейнері. Другий екземпляр отримував би застарілий кеш після правок в адмінці.
- **`NEXT_PUBLIC_*` і `R2_PUBLIC_BASE_URL` вбудовуються при збірці образу.** Змінили їх, перезберіть образ (`docker compose build app`).
- **SMTP.** Багато VPS-провайдерів блокують вихідні порти 25/465. Використовуйте 587.
- **Збірка потребує пам'яті.** Скрипт `build` дозволяє до 8 ГБ heap. Якщо VPS ділиться з іншими проєктами, збирайте образ в CI й тягніть готовий (`APP_IMAGE`) або додайте swap.
