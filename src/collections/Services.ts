import { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: { useAsTitle: 'title' },
  access: {
    read: () => true, // Відкриваємо доступ для читання фронтенду
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true, // Локалізуємо назву (es, en, uk)
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true, // Наприклад: 'implants', 'veneers'
    },
    {
      name: 'layout',
      type: 'blocks',
      localized: true, // Локалізуємо весь контент сторінки
      blocks: [
        // БЛОК 1: Шахматка (Текст + Фото)
        {
          slug: 'contentImage',
          labels: { singular: 'Текст + Фото', plural: 'Текст + Фото' },
          fields: [
            {
              name: 'position',
              type: 'select',
              options: [
                { label: 'Фото зліва', value: 'left' },
                { label: 'Фото справа', value: 'right' },
              ],
              defaultValue: 'left',
            },
            { name: 'text', type: 'richText', required: true },
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
          ],
        },
        // БЛОК 2: Акордеон (для довгих описів чи FAQ)
        {
          slug: 'accordion',
          labels: { singular: 'Акордеон', plural: 'Акордеони' },
          fields: [
            { name: 'heading', type: 'text', required: true, label: 'Заголовок пункту' },
            { name: 'content', type: 'richText', required: true, label: 'Прихований текст' },
          ],
        },
      ],
    },
  ],
}