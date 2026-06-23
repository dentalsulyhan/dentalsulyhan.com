import { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: {
    en: 'Home Page',
    uk: 'Головна сторінка',
    es: 'Página de Inicio',
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
    read: () => true,
  },
  fields: [
    // ─── Section Order & Visibility ───
    {
      name: 'sectionOrder',
      type: 'array',
      label: {
        en: 'Section Order & Visibility',
        uk: 'Порядок та видимість секцій',
        es: 'Orden y visibilidad de secciones',
      },
      admin: {
        description: {
          en: 'Drag to reorder sections. Uncheck "Enabled" to hide a section.',
          uk: 'Перетягуйте для зміни порядку. Зніміть галочку «Увімкнено», щоб приховати секцію.',
          es: 'Arrastre para reordenar. Desmarque "Habilitado" para ocultar una sección.',
        },
      },
      defaultValue: [
        { section: 'hero', enabled: true },
        { section: 'advantages', enabled: true },
        { section: 'aboutUs', enabled: true },
        { section: 'philosophy', enabled: true },
        { section: 'promotions', enabled: true },
        { section: 'team', enabled: true },
        { section: 'reviews', enabled: true },
        { section: 'gallery', enabled: true },
        { section: 'whyUs', enabled: true },
        { section: 'contacts', enabled: true },
      ],
      fields: [
        {
          name: 'section',
          type: 'select',
          required: true,
          label: {
            en: 'Section',
            uk: 'Секція',
            es: 'Sección',
          },
          options: [
            { label: 'Hero', value: 'hero' },
            { label: { en: 'Advantages', uk: 'Переваги', es: 'Ventajas' }, value: 'advantages' },
            { label: { en: 'About Us', uk: 'Про нас', es: 'Sobre Nosotros' }, value: 'aboutUs' },
            { label: { en: 'Philosophy', uk: 'Філософія', es: 'Filosofía' }, value: 'philosophy' },
            { label: { en: 'Promotions', uk: 'Промо', es: 'Promociones' }, value: 'promotions' },
            { label: { en: 'Team', uk: 'Команда', es: 'Equipo' }, value: 'team' },
            { label: { en: 'Reviews', uk: 'Відгуки', es: 'Reseñas' }, value: 'reviews' },
            { label: { en: 'Gallery', uk: 'Галерея', es: 'Galería' }, value: 'gallery' },
            { label: { en: 'Why Us', uk: 'Чому ми', es: 'Por qué' }, value: 'whyUs' },
            { label: { en: 'Contacts', uk: 'Контакти', es: 'Contacto' }, value: 'contacts' },
          ],
        },
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          label: {
            en: 'Enabled',
            uk: 'Увімкнено',
            es: 'Habilitado',
          },
        },
      ],
    },

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
          type: 'richText',
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
          localized: false,
          relationTo: 'media',
          label: {
            en: 'Icon',
            uk: 'Іконка',
            es: 'Icono',
          },
        },
      ],
    },

    // ─── 3. About Us (alternating blocks with title, richtext, button, image) ───
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
          maxRows: 5,
          label: {
            en: 'Content Blocks',
            uk: 'Блоки контенту',
            es: 'Bloques de contenido',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              localized: true,
              label: {
                en: 'Title (optional)',
                uk: 'Заголовок (необовʼязково)',
                es: 'Título (opcional)',
              },
            },
            {
              name: 'text',
              type: 'textarea',
              localized: true,
              required: true,
              label: {
                en: 'Content',
                uk: 'Вміст',
                es: 'Contenido',
              },
            },
            {
              name: 'buttonText',
              type: 'text',
              localized: true,
              label: {
                en: 'Button Text (optional)',
                uk: 'Текст кнопки (необовʼязково)',
                es: 'Texto del botón (opcional)',
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
                en: 'Photo',
                uk: 'Фото',
                es: 'Foto',
              },
            },
          ],
        },
      ],
    },

    // ─── 4. Philosophy (cards like advantages: icon + title + description) ───
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
          name: 'sectionTitle',
          type: 'text',
          localized: true,
          label: {
            en: 'Section Title (optional)',
            uk: 'Заголовок секції (необовʼязково)',
            es: 'Título de la sección (opcional)',
          },
        },
        {
          name: 'cards',
          type: 'array',
          label: {
            en: 'Philosophy Cards',
            uk: 'Картки філософії',
            es: 'Tarjetas de filosofía',
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
              type: 'richText',
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
              localized: false,
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
    },

    // ─── 5. Promotions (references Promotions collection — no fields needed here) ───
    // Промоакції підтягуються автоматично з колекції Promotions (isActive === true)
    // Секцію можна увімкнути/вимкнути через sectionOrder

    // ─── 6. Team (title only; members from TeamMembers collection) ───
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
            en: 'Section Title (optional)',
            uk: 'Заголовок секції (необовʼязково)',
            es: 'Título de la sección (opcional)',
          },
        },
        {
          name: 'subtitle',
          type: 'text',
          localized: true,
          label: {
            en: 'Subtitle (optional)',
            uk: 'Підзаголовок (необовʼязково)',
            es: 'Subtítulo (opcional)',
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
          type: 'richText',
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

    // ─── 10. Contacts Section (title + description; rest from SiteContacts) ───
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
            en: 'Section Title (optional)',
            uk: 'Заголовок секції (необовʼязково)',
            es: 'Título de la sección (opcional)',
          },
        },
        {
          name: 'description',
          type: 'richText',
          localized: true,
          label: {
            en: 'Description (optional)',
            uk: 'Опис (необовʼязково)',
            es: 'Descripción (opcional)',
          },
        },
      ],
    },
  ],
}
