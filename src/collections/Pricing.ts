import { CollectionConfig } from 'payload'

export const Pricing: CollectionConfig = {
  slug: 'pricing',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true, // Публічний доступ для Next.js
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Прайс-лист',
    },
    {
      name: 'categories',
      type: 'array',
      label: 'Категорії послуг',
      localized: true, // Локалізуємо весь масив для es, en, uk
      admin: {
        description: 'Додайте сюди категорії, наприклад "Діагностика та профілактика" або "Хірургія"',
      },
      fields: [
        {
          name: 'categoryTitle',
          type: 'text',
          required: true,
          label: 'Назва категорії',
        },
        {
          name: 'categoryDescription',
          type: 'textarea',
          label: 'Опис категорії (опціонально)',
          admin: {
            description: 'Наприклад: "Цей напрям вимагає ретельного планування..."',
          },
        },
        {
          name: 'servicesList',
          type: 'array',
          label: 'Список послуг у цій категорії',
          fields: [
            {
              name: 'serviceName',
              type: 'text',
              required: true,
              label: 'Назва послуги (напр. Перше відвідування)',
            },
            {
              name: 'price',
              type: 'text',
              required: true,
              label: 'Ціна (напр. 55,00€ або від 70€)',
            },
            {
              name: 'note',
              type: 'text',
              label: 'Примітка (напр. "включає рентген")',
              admin: {
                description: 'Додаткова інформація, яка буде виводитися дрібним шрифтом поруч із ціною',
              },
            },
          ],
        },
      ],
    },
  ],
}