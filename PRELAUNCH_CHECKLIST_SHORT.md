# Pre-Launch Checklist Short

## SEO

- [ ] Заповнити `SEO Settings -> baseUrl`
- [ ] Заповнити `siteName`, `titleTemplate`, `defaultOgImage`
- [ ] Заповнити `organizationName`, `organizationPhone`, `organizationEmail`, `organizationAddress`
- [ ] Перевірити `title`, `description`, canonical, `hreflang`, `x-default` для `/`, `/en`, `/uk`
- [ ] Перевірити `title`, `description`, canonical, `hreflang`, `x-default` для services listing
- [ ] Перевірити `title`, `description`, canonical, `hreflang`, `x-default` для 3 service pages у всіх локалях
- [ ] Перевірити `og:image` і `twitter:image`
- [ ] Перевірити `/robots.txt`
- [ ] Перевірити `/sitemap.xml`
- [ ] Перевірити JSON-LD на home, services listing, service detail
- [ ] Перевірити, що 404 має `noindex` і повертає HTTP 404

## WordPress Migration

- [ ] Зібрати список старих WordPress URL
- [ ] Зробити таблицю `old URL -> new URL -> 301`
- [ ] Реалізувати 301 редіректи
- [ ] Перевірити головні старі URL вручну
- [ ] Переконатися, що немає redirect chains і loops

## Content

- [ ] Перевірити всі сторінки і послуги в `es`
- [ ] Перевірити всі сторінки і послуги в `en`
- [ ] Перевірити всі сторінки і послуги в `uk`
- [ ] Дозаповнити локалізовані `metaTitle`
- [ ] Дозаповнити локалізовані `metaDescription`
- [ ] Перевірити всі CTA і заголовки
- [ ] Прибрати placeholder text
- [ ] Перевірити alt text у важливих зображень

## Navigation and UX

- [ ] Перевірити всі menu items
- [ ] Перевірити всі anchor links
- [ ] Перевірити language switcher
- [ ] Перевірити mobile menu
- [ ] Перевірити contact form
- [ ] Перевірити phone / WhatsApp / Telegram / email links

## Performance

- [ ] Перевести ключові зображення на `next/image`
- [ ] Оптимізувати hero images
- [ ] Оптимізувати service images
- [ ] Оптимізувати team / gallery / logo images
- [ ] Переконатися, що above-the-fold images не завеликі
- [ ] Стиснути важкі JPG/PNG assets
- [ ] Увімкнути тільки потрібні tracking scripts
- [ ] Перевірити third-party embeds
- [ ] Прогнати Lighthouse для home
- [ ] Прогнати Lighthouse для services listing
- [ ] Прогнати Lighthouse для service detail

## Accessibility

- [ ] Додати labels або accessible names у форму
- [ ] Перевірити keyboard navigation
- [ ] Перевірити focus states
- [ ] Перевірити contrast
- [ ] Перевірити alt text
- [ ] Перевірити heading order

## Production Setup

- [ ] Задати production env vars
- [ ] Задати production site URL
- [ ] Задати production Turnstile keys
- [ ] Задати email credentials
- [ ] Перевірити storage/CDN

## Final QA

- [ ] Desktop QA
- [ ] Mobile QA
- [ ] Cross-locale QA
- [ ] Перевірка live metadata після деплою
- [ ] Перевірка live redirects після деплою
