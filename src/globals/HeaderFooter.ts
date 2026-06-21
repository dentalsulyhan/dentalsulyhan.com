// Shared Header and Footer Configuration for DentalSulyhan
import { GlobalConfig } from 'payload'

export const HeaderFooter: GlobalConfig = {
  slug: 'header-footer',
  label: {
    en: 'Header and Footer',
    uk: 'Шапка та підвал',
    es: 'Cabecera y Pie',
  },
  access: {
    read: () => true, // Відкриваємо для Next.js
  },
  fields: [
    {
      name: 'menuItems',
      type: 'array',
      label: {
        en: 'Shared Menu Items',
        uk: 'Спільні пункти меню (для шапки та підвалу)',
        es: 'Elementos del menú compartidos',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          label: {
            en: 'Label',
            uk: 'Назва',
            es: 'Etiqueta',
          },
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          localized: false,
          label: {
            en: 'Link (e.g. /services or #about_us)',
            uk: 'Посилання (напр. /services або #about_us)',
            es: 'Enlace (ej. /services o #about_us)',
          },
        },
      ],
    },
    {
      name: 'header',
      type: 'group',
      label: {
        en: 'Header Settings',
        uk: 'Налаштування шапки',
        es: 'Configuración de cabecera',
      },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: {
            en: 'Header Logo',
            uk: 'Логотип шапки',
            es: 'Logo de cabecera',
          },
        },
        {
          name: 'menuButtonLabel',
          type: 'text',
          localized: true,
          label: {
            en: 'Menu Button Text (Burger)',
            uk: 'Текст кнопки меню (бургер)',
            es: 'Texto del botón de menú (hamburguesa)',
          },
          defaultValue: 'Menu',
        },
        {
          name: 'contacts',
          type: 'group',
          label: {
            en: 'Contacts in Header',
            uk: 'Контакти в шапці',
            es: 'Contactos en cabecera',
          },
          fields: [
            {
              name: 'phone',
              type: 'text',
              label: {
                en: 'Phone Number',
                uk: 'Номер телефону',
                es: 'Número de teléfono',
              },
              defaultValue: '+34 665-399-280',
            },
            {
              name: 'whatsapp',
              type: 'text',
              label: {
                en: 'WhatsApp Link',
                uk: 'Посилання на WhatsApp',
                es: 'Enlace de WhatsApp',
              },
              defaultValue: 'https://wa.me/+34665399280',
            },
            {
              name: 'telegram',
              type: 'text',
              label: {
                en: 'Telegram Link',
                uk: 'Посилання на Telegram',
                es: 'Enlace de Telegram',
              },
              defaultValue: 'https://t.me/+34665399280',
            },
          ],
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      label: {
        en: 'Footer Settings',
        uk: 'Налаштування підвалу',
        es: 'Configuración de pie de página',
      },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: {
            en: 'Footer Logo (Optional)',
            uk: 'Логотип підвалу (необовʼязково)',
            es: 'Logo de pie de página (Opcional)',
          },
        },
        {
          name: 'copyright',
          type: 'text',
          localized: true,
          label: {
            en: 'Copyright Text',
            uk: 'Копірайт',
            es: 'Texto de copyright',
          },
          defaultValue: '©2024 - All right reserved',
        },
        {
          name: 'socialLinks',
          type: 'array',
          label: {
            en: 'Social Links',
            uk: 'Соціальні мережі',
            es: 'Redes sociales',
          },
          fields: [
            {
              name: 'platform',
              type: 'select',
              label: {
                en: 'Platform',
                uk: 'Платформа',
                es: 'Plataforma',
              },
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
              label: {
                en: 'URL Link',
                uk: 'Посилання',
                es: 'Enlace',
              },
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
