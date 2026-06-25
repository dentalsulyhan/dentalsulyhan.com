import type { CollectionConfig } from 'payload'
import { blockThemeField, buttonStyleField } from '@/lib/blockThemes'

const sectionSpacingField = {
  name: 'compactSpacing',
  type: 'checkbox',
  defaultValue: false,
  label: {
    en: 'Compact section spacing',
    uk: 'Компактний відступ секції',
    es: 'Espaciado compacto de la seccion',
  },
  admin: {
    description: {
      en: 'Use smaller vertical padding when the block has only a title or a short intro.',
      uk: 'Менший вертикальний відступ для блоків з одним заголовком або коротким вступом.',
      es: 'Usa un espaciado vertical menor cuando el bloque tiene solo un titulo o una introduccion corta.',
    },
  },
} as const

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: {
      en: 'Page',
      uk: 'Сторінка',
      es: 'Pagina',
    },
    plural: {
      en: 'Pages',
      uk: 'Сторінки',
      es: 'Paginas',
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
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: {
        en: 'Page Title',
        uk: 'Назва сторінки',
        es: 'Titulo de la pagina',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: {
        en: 'Slug',
        uk: 'Slug',
        es: 'Slug',
      },
      admin: {
        description: {
          en: 'Use home for the homepage, 404 for the not found page, or a URL path like about-us',
          uk: 'Використовуйте home для головної, 404 для сторінки не знайдено або шлях типу about-us',
          es: 'Use home para la pagina principal, 404 para la pagina no encontrada o una ruta como about-us',
        },
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      localized: true,
      label: {
        en: 'Page Layout',
        uk: 'Конструктор сторінки',
        es: 'Constructor de pagina',
      },
      blocks: [
        {
          slug: 'hero',
          labels: {
            singular: {
              en: 'Homepage Hero',
              uk: 'Головний блок',
              es: 'Hero principal',
            },
            plural: {
              en: 'Homepage Hero Blocks',
              uk: 'Головні блоки',
              es: 'Bloques hero principal',
            },
          },
          fields: [
            blockThemeField,
            buttonStyleField,
            {
              name: 'title',
              type: 'textarea',
              required: true,
              label: {
                en: 'Title',
                uk: 'Заголовок',
                es: 'Titulo',
              },
            },
            {
              name: 'subtitle',
              type: 'textarea',
              label: {
                en: 'Subtitle',
                uk: 'Підзаголовок',
                es: 'Subtitulo',
              },
            },
            {
              name: 'buttonText',
              type: 'text',
              label: {
                en: 'Button Text',
                uk: 'Текст кнопки',
                es: 'Texto del boton',
              },
            },
            {
              name: 'buttonLink',
              type: 'text',
              label: {
                en: 'Button Link',
                uk: 'Посилання кнопки',
                es: 'Enlace del boton',
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: {
                en: 'Right-side Image',
                uk: 'Зображення справа',
                es: 'Imagen a la derecha',
              },
            },
          ],
        },
        {
          slug: 'advantages',
          labels: {
            singular: {
              en: 'Advantages',
              uk: 'Переваги',
              es: 'Ventajas',
            },
            plural: {
              en: 'Advantages Blocks',
              uk: 'Блоки переваг',
              es: 'Bloques de ventajas',
            },
          },
          fields: [
            blockThemeField,
            buttonStyleField,
            {
              name: 'sectionTitle',
              type: 'text',
              label: {
                en: 'Section Title',
                uk: 'Заголовок секції',
                es: 'Titulo de la seccion',
              },
            },
            sectionSpacingField,
            {
              name: 'itemLayout',
              type: 'select',
              defaultValue: 'column',
              options: [
                {
                  label: {
                    en: 'Icon and title in column',
                    uk: 'Іконка і заголовок в колонку',
                    es: 'Icono y titulo en columna',
                  },
                  value: 'column',
                },
                {
                  label: {
                    en: 'Icon and title in row',
                    uk: 'Іконка і заголовок в ряд',
                    es: 'Icono y titulo en fila',
                  },
                  value: 'row',
                },
              ],
              label: {
                en: 'Items Heading Layout',
                uk: 'Розкладка іконки та заголовка',
                es: 'Disposicion de icono y titulo',
              },
            },
            {
              name: 'items',
              type: 'array',
              required: true,
              minRows: 1,
              admin: {
                components: {
                  RowLabel: '/components/admin/TitleRowLabel#TitleRowLabel',
                },
              },
              labels: {
                singular: {
                  en: 'Advantage',
                  uk: 'Перевага',
                  es: 'Ventaja',
                },
                plural: {
                  en: 'Advantages',
                  uk: 'Переваги',
                  es: 'Ventajas',
                },
              },
              fields: [
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
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: {
                    en: 'Title',
                    uk: 'Заголовок',
                    es: 'Titulo',
                  },
                },
                {
                  name: 'text',
                  type: 'richText',
                  required: true,
                  label: {
                    en: 'Text',
                    uk: 'Текст',
                    es: 'Texto',
                  },
                  admin: {
                    description: {
                      en: 'Supports bold, italic and underline formatting.',
                      uk: 'Підтримує жирний, курсив і підкреслення.',
                      es: 'Admite negrita, cursiva y subrayado.',
                    },
                  },
                },
              ],
            },
            {
              name: 'buttonText',
              type: 'text',
              label: {
                en: 'Section Button Text',
                uk: 'Текст кнопки секції',
                es: 'Texto del boton de la seccion',
              },
            },
            {
              name: 'buttonLink',
              type: 'text',
              label: {
                en: 'Section Button Link',
                uk: 'Посилання кнопки секції',
                es: 'Enlace del boton de la seccion',
              },
            },
          ],
        },
        {
          slug: 'aboutUsGrid',
          labels: {
            singular: {
              en: 'About Us Chess Layout',
              uk: 'Про нас шахматка',
              es: 'Sobre nosotros en damero',
            },
            plural: {
              en: 'About Us Chess Blocks',
              uk: 'Блоки про нас шахматка',
              es: 'Bloques sobre nosotros damero',
            },
          },
          fields: [
            blockThemeField,
            buttonStyleField,
            {
              name: 'sectionTitle',
              type: 'text',
              label: {
                en: 'Section Title',
                uk: 'Заголовок секції',
                es: 'Titulo de la seccion',
              },
            },
            {
              name: 'buttonText',
              type: 'text',
              label: {
                en: 'Section Button Text',
                uk: 'Текст кнопки секції',
                es: 'Texto del boton de la seccion',
              },
            },
            {
              name: 'buttonLink',
              type: 'text',
              label: {
                en: 'Section Button Link',
                uk: 'Посилання кнопки секції',
                es: 'Enlace del boton de la seccion',
              },
            },
            {
              name: 'items',
              type: 'array',
              required: true,
              minRows: 1,
              labels: {
                singular: {
                  en: 'Chess Item',
                  uk: 'Елемент шахматки',
                  es: 'Elemento damero',
                },
                plural: {
                  en: 'Chess Items',
                  uk: 'Елементи шахматки',
                  es: 'Elementos damero',
                },
              },
              admin: {
                components: {
                  RowLabel: '/components/admin/TitleRowLabel#TitleRowLabel',
                },
                description: {
                  en: 'Frontend can alternate image and text automatically by order.',
                  uk: 'Фронтенд може автоматично чергувати фото і текст за порядком.',
                  es: 'El frontend puede alternar imagen y texto segun el orden.',
                },
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: {
                    en: 'Optional Title',
                    uk: 'Необовʼязковий заголовок',
                    es: 'Titulo opcional',
                  },
                },
                {
                  name: 'text',
                  type: 'richText',
                  required: true,
                  label: {
                    en: 'Text',
                    uk: 'Текст',
                    es: 'Texto',
                  },
                  admin: {
                    description: {
                      en: 'Supports bold, italic and underline formatting.',
                      uk: 'Підтримує жирний, курсив і підкреслення.',
                      es: 'Admite negrita, cursiva y subrayado.',
                    },
                  },
                },
                {
                  name: 'buttonText',
                  type: 'text',
                  label: {
                    en: 'Button Text',
                    uk: 'Текст кнопки',
                    es: 'Texto del boton',
                  },
                },
                {
                  name: 'buttonLink',
                  type: 'text',
                  label: {
                    en: 'Button Link',
                    uk: 'Посилання кнопки',
                    es: 'Enlace del boton',
                  },
                },
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
        {
          slug: 'philosophy',
          labels: {
            singular: {
              en: 'Philosophy Cards',
              uk: 'Філософія',
              es: 'Filosofia',
            },
            plural: {
              en: 'Philosophy Blocks',
              uk: 'Блоки філософії',
              es: 'Bloques de filosofia',
            },
          },
          fields: [
            blockThemeField,
            buttonStyleField,
            {
              name: 'sectionTitle',
              type: 'text',
              label: {
                en: 'Section Title',
                uk: 'Заголовок секції',
                es: 'Titulo de la seccion',
              },
            },
            sectionSpacingField,
            {
              name: 'itemLayout',
              type: 'select',
              defaultValue: 'column',
              options: [
                {
                  label: {
                    en: 'Icon and title in column',
                    uk: 'Іконка і заголовок в колонку',
                    es: 'Icono y titulo en columna',
                  },
                  value: 'column',
                },
                {
                  label: {
                    en: 'Icon and title in row',
                    uk: 'Іконка і заголовок в ряд',
                    es: 'Icono y titulo en fila',
                  },
                  value: 'row',
                },
              ],
              label: {
                en: 'Items Heading Layout',
                uk: 'Розкладка іконки та заголовка',
                es: 'Disposicion de icono y titulo',
              },
            },
            {
              name: 'items',
              type: 'array',
              required: true,
              minRows: 1,
              admin: {
                components: {
                  RowLabel: '/components/admin/TitleRowLabel#TitleRowLabel',
                },
              },
              labels: {
                singular: {
                  en: 'Card',
                  uk: 'Картка',
                  es: 'Tarjeta',
                },
                plural: {
                  en: 'Cards',
                  uk: 'Картки',
                  es: 'Tarjetas',
                },
              },
              fields: [
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
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: {
                    en: 'Title',
                    uk: 'Заголовок',
                    es: 'Titulo',
                  },
                },
                {
                  name: 'text',
                  type: 'richText',
                  required: true,
                  label: {
                    en: 'Text',
                    uk: 'Текст',
                    es: 'Texto',
                  },
                  admin: {
                    description: {
                      en: 'Supports bold, italic and underline formatting.',
                      uk: 'Підтримує жирний, курсив і підкреслення.',
                      es: 'Admite negrita, cursiva y subrayado.',
                    },
                  },
                },
              ],
            },
            {
              name: 'buttonText',
              type: 'text',
              label: {
                en: 'Section Button Text',
                uk: 'Текст кнопки секції',
                es: 'Texto del boton de la seccion',
              },
            },
            {
              name: 'buttonLink',
              type: 'text',
              label: {
                en: 'Section Button Link',
                uk: 'Посилання кнопки секції',
                es: 'Enlace del boton de la seccion',
              },
            },
          ],
        },
        {
          slug: 'promotions',
          labels: {
            singular: {
              en: 'Promotion Feature',
              uk: 'Блок акції',
              es: 'Bloque de promocion',
            },
            plural: {
              en: 'Promotion Feature Blocks',
              uk: 'Блоки акції',
              es: 'Bloques de promocion',
            },
          },
          fields: [
            blockThemeField,
            buttonStyleField,
            {
              name: 'position',
              type: 'select',
              defaultValue: 'left',
              options: [
                {
                  label: {
                    en: 'Image on Left',
                    uk: 'Зображення зліва',
                    es: 'Imagen a la izquierda',
                  },
                  value: 'left',
                },
                {
                  label: {
                    en: 'Image on Right',
                    uk: 'Зображення справа',
                    es: 'Imagen a la derecha',
                  },
                  value: 'right',
                },
              ],
              label: {
                en: 'Image Position',
                uk: 'Позиція зображення',
                es: 'Posicion de la imagen',
              },
            },
            {
              name: 'promotion',
              type: 'relationship',
              relationTo: 'promotions',
              required: true,
              label: {
                en: 'Promotion',
                uk: 'Акція',
                es: 'Promocion',
              },
            },
            {
              name: 'buttonText',
              type: 'text',
              label: {
                en: 'Button Text',
                uk: 'Текст кнопки',
                es: 'Texto del boton',
              },
            },
            {
              name: 'buttonLink',
              type: 'text',
              label: {
                en: 'Button Link',
                uk: 'Посилання кнопки',
                es: 'Enlace del boton',
              },
            },
          ],
        },
        {
          slug: 'gallery',
          labels: {
            singular: {
              en: 'Gallery Slider',
              uk: 'Галерея',
              es: 'Galeria',
            },
            plural: {
              en: 'Gallery Slider Blocks',
              uk: 'Блоки галереї',
              es: 'Bloques de galeria',
            },
          },
          fields: [
            blockThemeField,
            buttonStyleField,
            {
              name: 'position',
              type: 'select',
              defaultValue: 'right',
              options: [
                {
                  label: {
                    en: 'Slider on Left',
                    uk: 'Слайдер зліва',
                    es: 'Slider a la izquierda',
                  },
                  value: 'left',
                },
                {
                  label: {
                    en: 'Slider on Right',
                    uk: 'Слайдер справа',
                    es: 'Slider a la derecha',
                  },
                  value: 'right',
                },
              ],
              label: {
                en: 'Slider Position',
                uk: 'Позиція слайдера',
                es: 'Posicion del slider',
              },
            },
            {
              name: 'title',
              type: 'text',
              label: {
                en: 'Title',
                uk: 'Заголовок',
                es: 'Titulo',
              },
            },
            sectionSpacingField,
            {
              name: 'description',
              type: 'richText',
              label: {
                en: 'Description',
                uk: 'Опис',
                es: 'Descripcion',
              },
            },
            {
              name: 'images',
              type: 'array',
              required: true,
              minRows: 1,
              label: {
                en: 'Slides',
                uk: 'Слайди',
                es: 'Diapositivas',
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
            {
              name: 'buttonText',
              type: 'text',
              label: {
                en: 'Button Text',
                uk: 'Текст кнопки',
                es: 'Texto del boton',
              },
            },
            {
              name: 'buttonLink',
              type: 'text',
              label: {
                en: 'Button Link',
                uk: 'Посилання кнопки',
                es: 'Enlace del boton',
              },
            },
          ],
        },
        {
          slug: 'team',
          labels: {
            singular: {
              en: 'Team Section',
              uk: 'Секція команди',
              es: 'Seccion del equipo',
            },
            plural: {
              en: 'Team Blocks',
              uk: 'Блоки команди',
              es: 'Bloques del equipo',
            },
          },
          fields: [
            blockThemeField,
            buttonStyleField,
            {
              name: 'sectionTitle',
              type: 'text',
              label: {
                en: 'Section Title',
                uk: 'Заголовок секції',
                es: 'Titulo de la seccion',
              },
            },
            sectionSpacingField,
            {
              name: 'description',
              type: 'richText',
              label: {
                en: 'Description',
                uk: 'Опис',
                es: 'Descripcion',
              },
            },
            {
              name: 'source',
              type: 'select',
              defaultValue: 'all',
              options: [
                {
                  label: {
                    en: 'Show all team members',
                    uk: 'Показувати всіх членів команди',
                    es: 'Mostrar todo el equipo',
                  },
                  value: 'all',
                },
                {
                  label: {
                    en: 'Select team members manually',
                    uk: 'Вибрати членів команди вручну',
                    es: 'Seleccionar miembros manualmente',
                  },
                  value: 'manual',
                },
              ],
              label: {
                en: 'Data Source',
                uk: 'Джерело даних',
                es: 'Fuente de datos',
              },
            },
            {
              name: 'selectedMembers',
              type: 'relationship',
              relationTo: 'team-members',
              hasMany: true,
              label: {
                en: 'Selected Members',
                uk: 'Обрані члени команди',
                es: 'Miembros seleccionados',
              },
              admin: {
                condition: (_, siblingData) => siblingData.source === 'manual',
              },
            },
            {
              name: 'sliderLimit',
              type: 'number',
              defaultValue: 12,
              min: 1,
              label: {
                en: 'Members Limit',
                uk: 'Ліміт учасників',
                es: 'Limite de miembros',
              },
            },
            {
              name: 'buttonText',
              type: 'text',
              label: {
                en: 'Button Text',
                uk: 'Текст кнопки',
                es: 'Texto del boton',
              },
            },
            {
              name: 'buttonLink',
              type: 'text',
              label: {
                en: 'Button Link',
                uk: 'Посилання кнопки',
                es: 'Enlace del boton',
              },
            },
          ],
        },
        {
          slug: 'reviews',
          labels: {
            singular: {
              en: 'Reviews Section',
              uk: 'Секція відгуків',
              es: 'Seccion de resenas',
            },
            plural: {
              en: 'Reviews Blocks',
              uk: 'Блоки відгуків',
              es: 'Bloques de resenas',
            },
          },
          fields: [
            blockThemeField,
            buttonStyleField,
            {
              name: 'sectionTitle',
              type: 'text',
              label: {
                en: 'Section Title',
                uk: 'Заголовок секції',
                es: 'Titulo de la seccion',
              },
            },
            sectionSpacingField,
            {
              name: 'embedCode',
              type: 'textarea',
              label: {
                en: 'Embed Code / Widget Markup',
                uk: 'Embed-код / код віджета',
                es: 'Codigo embed / widget',
              },
              admin: {
                description: {
                  en: 'Paste the review widget code or placeholder markup.',
                  uk: 'Встав код віджета відгуків або тимчасову розмітку.',
                  es: 'Pegue el codigo del widget de resenas o un marcador temporal.',
                },
              },
            },
            {
              name: 'buttonText',
              type: 'text',
              label: {
                en: 'Button Text',
                uk: 'Текст кнопки',
                es: 'Texto del boton',
              },
            },
            {
              name: 'buttonLink',
              type: 'text',
              label: {
                en: 'Button Link',
                uk: 'Посилання кнопки',
                es: 'Enlace del boton',
              },
            },
          ],
        },
        {
          slug: 'contentImage',
          labels: {
            singular: {
              en: 'Image + Text',
              uk: 'Фото + текст',
              es: 'Imagen + texto',
            },
            plural: {
              en: 'Image + Text Blocks',
              uk: 'Блоки фото + текст',
              es: 'Bloques imagen + texto',
            },
          },
          fields: [
            blockThemeField,
            buttonStyleField,
            {
              name: 'position',
              type: 'select',
              defaultValue: 'left',
              options: [
                {
                  label: {
                    en: 'Image on Left',
                    uk: 'Зображення зліва',
                    es: 'Imagen a la izquierda',
                  },
                  value: 'left',
                },
                {
                  label: {
                    en: 'Image on Right',
                    uk: 'Зображення справа',
                    es: 'Imagen a la derecha',
                  },
                  value: 'right',
                },
              ],
              label: {
                en: 'Image Position',
                uk: 'Позиція зображення',
                es: 'Posicion de la imagen',
              },
            },
            {
              name: 'imageWidth',
              type: 'select',
              defaultValue: 'full',
              options: [
                {
                  label: {
                    en: 'Full width',
                    uk: 'На всю ширину',
                    es: 'Ancho completo',
                  },
                  value: 'full',
                },
                {
                  label: {
                    en: 'Contained',
                    uk: 'У контейнері',
                    es: 'Contenido en contenedor',
                  },
                  value: 'contained',
                },
              ],
              label: {
                en: 'Image Width',
                uk: 'Ширина фото',
                es: 'Ancho de la imagen',
              },
            },
            {
              name: 'title',
              type: 'text',
              label: {
                en: 'Title',
                uk: 'Заголовок',
                es: 'Titulo',
              },
            },
            {
              name: 'text',
              type: 'richText',
              required: true,
              label: {
                en: 'Text',
                uk: 'Текст',
                es: 'Texto',
              },
              admin: {
                description: {
                  en: 'Supports bold, italic and underline formatting.',
                  uk: 'Підтримує жирний, курсив і підкреслення.',
                  es: 'Admite negrita, cursiva y subrayado.',
                },
              },
            },
            {
              name: 'buttonText',
              type: 'text',
              label: {
                en: 'Button Text',
                uk: 'Текст кнопки',
                es: 'Texto del boton',
              },
            },
            {
              name: 'buttonLink',
              type: 'text',
              label: {
                en: 'Button Link',
                uk: 'Посилання кнопки',
                es: 'Enlace del boton',
              },
            },
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
        {
          slug: 'pricingGroupShowcase',
          labels: {
            singular: {
              en: 'Pricing Group Showcase',
              uk: 'Блок групи послуг',
              es: 'Bloque de grupo de precios',
            },
            plural: {
              en: 'Pricing Group Showcases',
              uk: 'Блоки груп послуг',
              es: 'Bloques de grupos de precios',
            },
          },
          fields: [
            blockThemeField,
            {
              name: 'position',
              type: 'select',
              defaultValue: 'left',
              options: [
                {
                  label: {
                    en: 'Image on Left',
                    uk: 'Зображення зліва',
                    es: 'Imagen a la izquierda',
                  },
                  value: 'left',
                },
                {
                  label: {
                    en: 'Image on Right',
                    uk: 'Зображення справа',
                    es: 'Imagen a la derecha',
                  },
                  value: 'right',
                },
              ],
              label: {
                en: 'Image Position',
                uk: 'Позиція зображення',
                es: 'Posicion de la imagen',
              },
            },
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
            {
              name: 'pricingGroup',
              type: 'relationship',
              relationTo: 'pricing',
              required: true,
              label: {
                en: 'Pricing Group',
                uk: 'Група послуг',
                es: 'Grupo de precios',
              },
            },
          ],
        },
        {
          slug: 'content',
          labels: {
            singular: {
              en: 'Centered Text',
              uk: 'Центрований текст',
              es: 'Texto centrado',
            },
            plural: {
              en: 'Centered Text Blocks',
              uk: 'Блоки центрованого тексту',
              es: 'Bloques de texto centrado',
            },
          },
          fields: [
            blockThemeField,
            buttonStyleField,
            {
              name: 'title',
              type: 'text',
              label: {
                en: 'Title',
                uk: 'Заголовок',
                es: 'Titulo',
              },
            },
            sectionSpacingField,
            {
              name: 'content',
              type: 'richText',
              label: {
                en: 'Content',
                uk: 'Контент',
                es: 'Contenido',
              },
              admin: {
                description: {
                  en: 'Supports bold, italic and underline formatting.',
                  uk: 'Підтримує жирний, курсив і підкреслення.',
                  es: 'Admite negrita, cursiva y subrayado.',
                },
              },
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              label: {
                en: 'Background Image',
                uk: 'Фонове зображення',
                es: 'Imagen de fondo',
              },
              admin: {
                description: {
                  en: 'Optional background image for this centered text block.',
                  uk: 'Необовʼязкове фонове зображення для цього блоку.',
                  es: 'Imagen de fondo opcional para este bloque de texto centrado.',
                },
              },
            },
            {
              name: 'overlayColor',
              type: 'text',
              defaultValue: '#000000',
              label: {
                en: 'Overlay Color',
                uk: 'Колір оверлею',
                es: 'Color de superposicion',
              },
              admin: {
                description: {
                  en: 'Hex color for the overlay that sits on top of the background image.',
                  uk: 'HEX-колір для накладки поверх фонового зображення.',
                  es: 'Color hex para la capa sobre la imagen de fondo.',
                },
              },
            },
            {
              name: 'overlayOpacity',
              type: 'number',
              defaultValue: 35,
              min: 0,
              max: 100,
              label: {
                en: 'Overlay Opacity',
                uk: 'Прозорість оверлею',
                es: 'Opacidad de superposicion',
              },
              admin: {
                description: {
                  en: '0 means fully transparent, 100 means fully opaque.',
                  uk: '0 - повністю прозорий, 100 - повністю непрозорий.',
                  es: '0 es totalmente transparente, 100 es totalmente opaco.',
                },
              },
            },
            {
              name: 'buttonText',
              type: 'text',
              label: {
                en: 'Button Text',
                uk: 'Текст кнопки',
                es: 'Texto del boton',
              },
            },
            {
              name: 'buttonLink',
              type: 'text',
              label: {
                en: 'Button Link',
                uk: 'Посилання кнопки',
                es: 'Enlace del boton',
              },
            },
          ],
        },
        {
          slug: 'globalContactSection',
          labels: {
            singular: {
              en: 'Global Contact Section',
              uk: 'Глобальний блок контактів',
              es: 'Bloque global de contacto',
            },
            plural: {
              en: 'Global Contact Sections',
              uk: 'Глобальні блоки контактів',
              es: 'Bloques globales de contacto',
            },
          },
          fields: [blockThemeField, sectionSpacingField],
        },
        {
          slug: 'contactSection',
          labels: {
            singular: {
              en: 'Contacts + Form',
              uk: 'Контакти + форма',
              es: 'Contactos + formulario',
            },
            plural: {
              en: 'Contacts + Form Blocks',
              uk: 'Блоки контакти + форма',
              es: 'Bloques contactos + formulario',
            },
          },
          fields: [
            blockThemeField,
            {
              name: 'sectionTitle',
              type: 'text',
              label: {
                en: 'Section Title',
                uk: 'Заголовок секції',
                es: 'Titulo de la seccion',
              },
            },
            sectionSpacingField,
            {
              name: 'sectionDescription',
              type: 'richText',
              label: {
                en: 'Section Description',
                uk: 'Опис секції',
                es: 'Descripcion de la seccion',
              },
            },
            {
              name: 'formTitle',
              type: 'text',
              label: {
                en: 'Form Title',
                uk: 'Заголовок форми',
                es: 'Titulo del formulario',
              },
            },
            {
              name: 'formDescription',
              type: 'richText',
              label: {
                en: 'Form Description',
                uk: 'Опис форми',
                es: 'Descripcion del formulario',
              },
            },
            {
              name: 'submitButtonLabel',
              type: 'text',
              localized: true,
              label: {
                en: 'Submit Button Label',
                uk: 'Текст кнопки відправки',
                es: 'Texto del boton enviar',
              },
            },
            {
              name: 'fullNamePlaceholder',
              type: 'text',
              localized: true,
              label: {
                en: 'Full Name Placeholder',
                uk: 'Плейсхолдер ПІБ',
                es: 'Placeholder nombre completo',
              },
            },
            {
              name: 'phonePlaceholder',
              type: 'text',
              localized: true,
              label: {
                en: 'Phone Placeholder',
                uk: 'Плейсхолдер телефону',
                es: 'Placeholder telefono',
              },
            },
            {
              name: 'emailPlaceholder',
              type: 'text',
              localized: true,
              label: {
                en: 'Email Placeholder',
                uk: 'Плейсхолдер email',
                es: 'Placeholder email',
              },
            },
            {
              name: 'patientTypePlaceholder',
              type: 'text',
              localized: true,
              label: {
                en: 'Patient Type Placeholder',
                uk: 'Плейсхолдер типу пацієнта',
                es: 'Placeholder tipo de paciente',
              },
            },
            {
              name: 'patientTypeOptions',
              type: 'array',
              labels: {
                singular: {
                  en: 'Patient Type Option',
                  uk: 'Варіант типу пацієнта',
                  es: 'Opcion tipo de paciente',
                },
                plural: {
                  en: 'Patient Type Options',
                  uk: 'Варіанти типу пацієнта',
                  es: 'Opciones tipo de paciente',
                },
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  localized: true,
                  required: true,
                  label: {
                    en: 'Label',
                    uk: 'Назва',
                    es: 'Etiqueta',
                  },
                },
              ],
            },
            {
              name: 'referralSourcePlaceholder',
              type: 'text',
              localized: true,
              label: {
                en: 'Referral Source Placeholder',
                uk: 'Плейсхолдер звідки дізнався',
                es: 'Placeholder como nos conocio',
              },
            },
            {
              name: 'referralSourceOptions',
              type: 'array',
              labels: {
                singular: {
                  en: 'Referral Source Option',
                  uk: 'Варіант джерела',
                  es: 'Opcion fuente',
                },
                plural: {
                  en: 'Referral Source Options',
                  uk: 'Варіанти джерела',
                  es: 'Opciones fuente',
                },
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  localized: true,
                  required: true,
                  label: {
                    en: 'Label',
                    uk: 'Назва',
                    es: 'Etiqueta',
                  },
                },
              ],
            },
            {
              name: 'commentPlaceholder',
              type: 'text',
              localized: true,
              label: {
                en: 'Comment Placeholder',
                uk: 'Плейсхолдер коментаря',
                es: 'Placeholder comentario',
              },
            },
            {
              name: 'successMessage',
              type: 'textarea',
              localized: true,
              label: {
                en: 'Success Message',
                uk: 'Повідомлення про успішну відправку',
                es: 'Mensaje de envio exitoso',
              },
            },
            {
              name: 'errorMessage',
              type: 'textarea',
              localized: true,
              label: {
                en: 'Error Message',
                uk: 'Повідомлення про помилку',
                es: 'Mensaje de error',
              },
            },
            {
              name: 'contactRowsOrder',
              type: 'array',
              admin: {
                description: {
                  en: 'Reorder rows shown in the left contact column.',
                  uk: 'Перетягуйте, щоб змінити порядок рядків у лівій колонці контактів.',
                  es: 'Reordena las filas mostradas en la columna izquierda de contactos.',
                },
              },
              labels: {
                singular: {
                  en: 'Contact Row',
                  uk: 'Рядок контакту',
                  es: 'Fila de contacto',
                },
                plural: {
                  en: 'Contact Rows Order',
                  uk: 'Порядок рядків контакту',
                  es: 'Orden de filas de contacto',
                },
              },
              fields: [
                {
                  name: 'row',
                  type: 'select',
                  required: true,
                  options: [
                    {
                      label: {
                        en: 'Email',
                        uk: 'Email',
                        es: 'Email',
                      },
                      value: 'email',
                    },
                    {
                      label: {
                        en: 'Phone',
                        uk: 'Телефон',
                        es: 'Telefono',
                      },
                      value: 'phone',
                    },
                    {
                      label: {
                        en: 'Address',
                        uk: 'Адреса',
                        es: 'Direccion',
                      },
                      value: 'address',
                    },
                    {
                      label: {
                        en: 'Transport',
                        uk: 'Транспорт',
                        es: 'Transporte',
                      },
                      value: 'transport',
                    },
                    {
                      label: {
                        en: 'Social Links',
                        uk: 'Соцмережі',
                        es: 'Redes sociales',
                      },
                      value: 'social',
                    },
                  ],
                  label: {
                    en: 'Row',
                    uk: 'Рядок',
                    es: 'Fila',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
