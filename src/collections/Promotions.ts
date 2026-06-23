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
  admin: {
    useAsTitle: 'title',
    group: {
      en: 'Content',
      uk: 'Контент',
      es: 'Contenido',
    },
  },
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
      type: 'richText',
      admin: {
        hidden: true,
      },
      localized: true,
      label: {
        en: 'Description',
        uk: 'Опис',
        es: 'Descripción',
      },
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      label: {
        en: 'Formatted Content',
        uk: 'Форматований контент',
        es: 'Contenido con formato',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: {
        en: 'Promotion Image',
        uk: 'Зображення акції',
        es: 'Imagen de la promocion',
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
