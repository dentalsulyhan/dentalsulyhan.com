import { CollectionConfig } from 'payload'

export const Pricing: CollectionConfig = {
  slug: 'pricing',
  labels: {
    singular: {
      en: 'Pricing Group',
      uk: 'Група послуг',
      es: 'Grupo de precios',
    },
    plural: {
      en: 'Pricing Groups',
      uk: 'Групи послуг',
      es: 'Grupos de precios',
    },
  },
  admin: {
    useAsTitle: 'title',
    group: {
      en: 'Content',
      uk: 'Контент',
      es: 'Contenido',
    },
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
      defaultValue: 'Група послуг',
      label: {
        en: 'Group Title',
        uk: 'Назва групи',
        es: 'Titulo del grupo',
      },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      label: {
        en: 'Group Description',
        uk: 'Опис групи',
        es: 'Descripcion del grupo',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: {
        en: 'Group Items',
        uk: 'Пункти групи',
        es: 'Elementos del grupo',
      },
      fields: [
        {
          name: 'serviceName',
          type: 'text',
          required: true,
          localized: true,
          label: {
            en: 'Service Name',
            uk: 'Назва послуги',
            es: 'Nombre del servicio',
          },
        },
        {
          name: 'price',
          type: 'text',
          required: true,
          label: {
            en: 'Price',
            uk: 'Ціна',
            es: 'Precio',
          },
        },
        {
          name: 'pricePrefix',
          type: 'text',
          localized: true,
          label: {
            en: 'Price Prefix',
            uk: 'Префікс ціни',
            es: 'Prefijo del precio',
          },
          admin: {
            description: {
              en: 'Optional. For example: from',
              uk: 'Необовʼязково. Наприклад: від',
              es: 'Opcional. Por ejemplo: desde',
            },
          },
        },
        {
          name: 'note',
          type: 'text',
          localized: true,
          label: {
            en: 'Note',
            uk: 'Примітка',
            es: 'Nota',
          },
        },
        {
          name: 'servicePage',
          type: 'relationship',
          relationTo: 'services',
          label: {
            en: 'Detail Service Page',
            uk: 'Детальна сторінка послуги',
            es: 'Pagina detallada del servicio',
          },
          admin: {
            description: {
              en: 'Optional. Link this pricing row to a detailed service page.',
              uk: 'Необовʼязково. Привʼяжіть цей рядок до детальної сторінки послуги.',
              es: 'Opcional. Vincula esta fila con una pagina detallada del servicio.',
            },
          },
        },
      ],
    },
    {
      name: 'detailsLinkLabel',
      type: 'text',
      localized: true,
      label: {
        en: 'Row Link Label',
        uk: 'Текст посилання в рядку',
        es: 'Texto del enlace en la fila',
      },
    },
    {
      name: 'categories',
      type: 'array',
      admin: {
        hidden: true,
        description: 'Додайте сюди категорії, наприклад "Діагностика та профілактика" або "Хірургія"',
      },
      label: {
        en: 'Service Categories',
        uk: 'Категорії послуг',
        es: 'Categorías de Servicios',
      },
      localized: true, // Локалізуємо весь масив для es, en, uk
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
          type: 'richText',
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
