import { CollectionConfig } from 'payload'

export const Pricing: CollectionConfig = {
  slug: 'pricing',
  labels: {
    singular: {
      en: 'Pricing List',
      uk: 'Прайс-лист',
      es: 'Lista de Precios',
    },
    plural: {
      en: 'Pricing Lists',
      uk: 'Прайс-листи',
      es: 'Listas de Precios',
    },
  },
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
      label: {
        en: 'Title',
        uk: 'Заголовок',
        es: 'Título',
      },
    },
    {
      name: 'categories',
      type: 'array',
      label: {
        en: 'Service Categories',
        uk: 'Категорії послуг',
        es: 'Categorías de Servicios',
      },
      localized: true, // Локалізуємо весь масив для es, en, uk
      admin: {
        description: 'Додайте сюди категорії, наприклад "Діагностика та профілактика" або "Хірургія"',
      },
      fields: [
        {
          name: 'categoryTitle',
          type: 'text',
          required: true,
          label: {
            en: 'Category Title',
            uk: 'Назва категорії',
            es: 'Título de Categoría',
          },
        },
        {
          name: 'categoryDescription',
          type: 'textarea',
          label: {
            en: 'Category Description (Optional)',
            uk: 'Опис категорії (опціонально)',
            es: 'Descripción de Categoría (Opcional)',
          },
          admin: {
            description: 'Наприклад: "Цей напрям вимагає ретельного планування..."',
          },
        },
        {
          name: 'servicesList',
          type: 'array',
          label: {
            en: 'Services List in Category',
            uk: 'Список послуг у цій категорії',
            es: 'Lista de Servicios en Categoría',
          },
          fields: [
            {
              name: 'serviceName',
              type: 'text',
              required: true,
              label: {
                en: 'Service Name',
                uk: 'Назва послуги',
                es: 'Nombre del Servicio',
              },
            },
            {
              name: 'price',
              type: 'text',
              required: true,
              label: {
                en: 'Price (e.g. 55,00€)',
                uk: 'Ціна (напр. 55,00€ або від 70€)',
                es: 'Precio (ej. 55,00€)',
              },
            },
            {
              name: 'note',
              type: 'text',
              label: {
                en: 'Note (Optional)',
                uk: 'Примітка (напр. "включає рентген")',
                es: 'Nota (Opcional)',
              },
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