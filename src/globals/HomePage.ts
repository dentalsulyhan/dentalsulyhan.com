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
    // ─── 1. Hero (First Section / Main Block) ───
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
          name: 'buttonLink',
          type: 'text',
          label: {
            en: 'Button Link',
            uk: 'Посилання кнопки',
            es: 'Enlace del botón',
          },
          defaultValue: '#contact_us',
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

    // ─── 2. Advantages ───
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

    // ─── 3. About Us (3 alternating blocks) ───
    {
      name: 'aboutUs',
      type: 'group',
      label: {
        en: 'About Us',
        uk: 'Про нас',
        es: 'Sobre Nosotros',
      },
      fields: [
        {
          name: 'blocks',
          type: 'array',
          maxRows: 3,
          label: {
            en: 'Content Blocks',
            uk: 'Блоки контенту',
            es: 'Bloques de contenido',
          },
          fields: [
            {
              name: 'text',
              type: 'textarea',
              localized: true,
              required: true,
              label: {
                en: 'Text',
                uk: 'Текст',
                es: 'Texto',
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: {
                en: 'Photo',
                uk: 'Фото',
                es: 'Foto',
              },
            },
          ],
        },
      ],
    },

    // ─── 4. Philosophy ───
    {
      name: 'philosophy',
      type: 'group',
      label: {
        en: 'Philosophy & Values',
        uk: 'Філософія та цінності',
        es: 'Filosofía y valores',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: {
            en: 'Section Title',
            uk: 'Заголовок секції',
            es: 'Título de la sección',
          },
        },
        {
          name: 'text',
          type: 'textarea',
          localized: true,
          label: {
            en: 'Text',
            uk: 'Текст',
            es: 'Texto',
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
          name: 'buttonLink',
          type: 'text',
          label: {
            en: 'Button Link',
            uk: 'Посилання кнопки',
            es: 'Enlace del botón',
          },
          defaultValue: '#contact_us',
        },
      ],
    },

    // ─── 5. Offers ───
    {
      name: 'offers',
      type: 'group',
      label: {
        en: 'Offers',
        uk: 'Пропозиції',
        es: 'Ofertas',
      },
      fields: [
        {
          name: 'text',
          type: 'textarea',
          localized: true,
          label: {
            en: 'Text',
            uk: 'Текст',
            es: 'Texto',
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

    // ─── 6. Team (title only; members come from TeamMembers collection) ───
    {
      name: 'teamSection',
      type: 'group',
      label: {
        en: 'Team Section',
        uk: 'Секція команди',
        es: 'Sección del equipo',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: {
            en: 'Section Title',
            uk: 'Заголовок секції',
            es: 'Título de la sección',
          },
        },
      ],
    },

    // ─── 7. Reviews ───
    {
      name: 'reviews',
      type: 'group',
      label: {
        en: 'Reviews',
        uk: 'Відгуки',
        es: 'Reseñas',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: {
            en: 'Section Title',
            uk: 'Заголовок секції',
            es: 'Título de la sección',
          },
        },
        {
          name: 'embedCode',
          type: 'textarea',
          label: {
            en: 'Embed Code (HTML)',
            uk: 'Код вставки (HTML)',
            es: 'Código embed (HTML)',
          },
          admin: {
            description: {
              en: 'Paste Google Reviews widget or other HTML embed code here',
              uk: 'Вставте віджет Google Reviews або інший HTML-код тут',
              es: 'Pegue el widget de Google Reviews u otro código HTML aquí',
            },
          },
        },
      ],
    },

    // ─── 8. Gallery ───
    {
      name: 'gallery',
      type: 'group',
      label: {
        en: 'Photo Gallery',
        uk: 'Фотогалерея',
        es: 'Galería de fotos',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: {
            en: 'Section Title',
            uk: 'Заголовок секції',
            es: 'Título de la sección',
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
          name: 'images',
          type: 'array',
          label: {
            en: 'Photos',
            uk: 'Фотографії',
            es: 'Fotos',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: {
                en: 'Image',
                uk: 'Зображення',
                es: 'Imagen',
              },
            },
          ],
        },
      ],
    },

    // ─── 9. Why Us ───
    {
      name: 'whyUs',
      type: 'group',
      label: {
        en: 'Why Choose Us',
        uk: 'Чому ми',
        es: 'Por qué elegirnos',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: {
            en: 'Section Title',
            uk: 'Заголовок секції',
            es: 'Título de la sección',
          },
        },
        {
          name: 'text',
          type: 'textarea',
          localized: true,
          label: {
            en: 'Text',
            uk: 'Текст',
            es: 'Texto',
          },
        },
      ],
    },

    // ─── 10. Contacts Section ───
    {
      name: 'contactsSection',
      type: 'group',
      label: {
        en: 'Contact Section',
        uk: 'Секція контактів',
        es: 'Sección de contacto',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: {
            en: 'Section Title',
            uk: 'Заголовок секції',
            es: 'Título de la sección',
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
      ],
    },
  ],
}