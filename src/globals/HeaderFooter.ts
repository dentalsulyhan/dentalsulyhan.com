import { GlobalConfig } from 'payload'

export const HeaderFooter: GlobalConfig = {
  slug: 'header-footer',
  access: {
    read: () => true, // Відкриваємо для Next.js
  },
  fields: [
    {
      name: 'header',
      type: 'group',
      label: 'Шапка (Header)',
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Логотип шапки',
        },
        {
          name: 'menuButtonLabel',
          type: 'text',
          localized: true,
          label: 'Текст кнопки меню (бургер)',
          defaultValue: 'Menu',
        },
        {
          name: 'menuItems',
          type: 'array',
          label: 'Пункти меню шапки',
          fields: [
            { name: 'label', type: 'text', required: true, localized: true, label: 'Назва (напр. Tratamientos)' },
            { name: 'link', type: 'text', required: true, localized: false, label: 'Посилання (напр. /services або #about_us)' },
          ],
        },
        {
          name: 'contacts',
          type: 'group',
          label: 'Контакти в шапці',
          fields: [
            {
              name: 'phone',
              type: 'text',
              label: 'Номер телефону',
              defaultValue: '+34 665-399-280',
            },
            {
              name: 'whatsapp',
              type: 'text',
              label: 'Посилання на WhatsApp',
              defaultValue: 'https://wa.me/+34665399280',
            },
            {
              name: 'telegram',
              type: 'text',
              label: 'Посилання на Telegram',
              defaultValue: 'https://t.me/+34665399280',
            },
          ],
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      label: 'Підвал (Footer)',
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Логотип підвалу (необовʼязково)',
        },
        {
          name: 'menuItems',
          type: 'array',
          label: 'Пункти меню підвалу',
          fields: [
            { name: 'label', type: 'text', required: true, localized: true, label: 'Назва' },
            { name: 'link', type: 'text', required: true, localized: false, label: 'Посилання' },
          ],
        },
        {
          name: 'copyright',
          type: 'text',
          localized: true,
          label: 'Копірайт',
          defaultValue: '©2024 - All right reserved',
        },
        {
          name: 'socialLinks',
          type: 'array',
          label: 'Соціальні мережі',
          fields: [
            {
              name: 'platform',
              type: 'select',
              label: 'Платформа',
              required: true,
              options: [
                { label: 'Instagram', value: 'instagram' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'Twitter / X', value: 'twitter' },
                { label: 'YouTube', value: 'youtube' },
              ],
            },
            {
              name: 'url',
              type: 'text',
              label: 'Посилання',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}