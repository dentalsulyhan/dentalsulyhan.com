// Shared Header and Footer Configuration for DentalSulyhan
import { GlobalConfig } from 'payload'

export const HeaderFooter: GlobalConfig = {
  slug: 'header-footer',
  label: {
    en: 'Header and Footer',
    uk: 'Шапка та підвал',
    es: 'Cabecera y Pie',
  },
  admin: {
    hidden: true,
    group: {
      en: 'Legacy',
      uk: 'Legacy',
      es: 'Legacy',
    },
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
      ],
    },
  ],
}
