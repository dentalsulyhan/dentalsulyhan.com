import { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: {
    en: 'Home Page',
    uk: 'Головна сторінка',
    es: 'Página de Inicio',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: {
        en: 'Hero Section',
        uk: 'Головний екран',
        es: 'Sección Hero',
      },
      fields: [
        {
          name: 'title',
          type: 'textarea',
          localized: true,
          required: true,
          label: {
            en: 'Title',
            uk: 'Заголовок',
            es: 'Título',
          },
        },
        {
          name: 'subtitle',
          type: 'text',
          localized: true,
          label: {
            en: 'Subtitle',
            uk: 'Підзаголовок',
            es: 'Subtítulo',
          },
        },
        {
          name: 'buttonText',
          type: 'text',
          localized: true,
          label: {
            en: 'Button Text',
            uk: 'Текст кнопки',
            es: 'Texto del botón',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: {
            en: 'Image',
            uk: 'Зображення',
            es: 'Imagen',
          },
        },
      ],
    },
    {
      name: 'advantages',
      type: 'array',
      label: {
        en: 'Advantages',
        uk: 'Переваги',
        es: 'Ventajas',
      },
      localized: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: {
            en: 'Title',
            uk: 'Заголовок',
            es: 'Título',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: {
            en: 'Description',
            uk: 'Опис',
            es: 'Descripción',
          },
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: {
            en: 'Icon',
            uk: 'Іконка',
            es: 'Icono',
          },
        },
      ],
    },
  ],
}