import { CollectionConfig } from 'payload'

export const Promotions: CollectionConfig = {
  slug: 'promotions',
  labels: {
    singular: {
      en: 'Promotion',
      uk: 'Акція',
      es: 'Promoción',
    },
    plural: {
      en: 'Promotions',
      uk: 'Акції',
      es: 'Promociones',
    },
  },
  admin: { useAsTitle: 'title' },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: {
        en: 'Title',
        uk: 'Заголовок',
        es: 'Título',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: {
        en: 'Description',
        uk: 'Опис',
        es: 'Descripción',
      },
    },
    {
      name: 'validUntil',
      type: 'date',
      label: {
        en: 'Valid Until',
        uk: 'Акція діє до:',
        es: 'Válida Hasta',
      },
      required: true,
      admin: {
        date: {
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: {
        en: 'Is Active',
        uk: 'Активна',
        es: 'Activa',
      },
    },
  ],
}