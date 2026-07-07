import type { CollectionConfig, Field } from 'payload'
import { blockThemeField, buttonStyleField } from '@/lib/blockThemes'
import { createPageRevalidationHooks } from '@/lib/cacheRevalidation'
import { seoFields } from '@/lib/seoFields'

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

const incompleteRowAlignmentField: Field = {
  name: 'incompleteRowAlignment',
  type: 'select',
  defaultValue: 'center',
  options: [
    {
      label: {
        en: 'Center incomplete last row',
        uk: 'Центрувати неповний останній ряд',
        es: 'Centrar la ultima fila incompleta',
      },
      value: 'center',
    },
    {
      label: {
        en: 'Align incomplete last row to start',
        uk: 'Притиснути неповний останній ряд вліво',
        es: 'Alinear la ultima fila incompleta al inicio',
      },
      value: 'start',
    },
  ],
  label: {
    en: 'Incomplete Last Row Alignment',
    uk: 'Вирівнювання неповного останнього ряду',
    es: 'Alineacion de la ultima fila incompleta',
  },
}

function collapsibleField(
  label: { en: string; uk: string; es: string },
  fields: Field[],
  initCollapsed = true,
): Field {
  return {
    type: 'collapsible',
    label,
    admin: {
      initCollapsed,
    },
    fields,
  }
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  hooks: {
    afterChange: [createPageRevalidationHooks().afterChange],
    afterDelete: [createPageRevalidationHooks().afterDelete],
  },
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
        en: 'Internal Key',
        uk: 'Внутрішній ключ',
        es: 'Clave interna',
      },
      admin: {
        description: {
          en: 'Stable internal identifier. Use values like home, services, 404 or about.',
          uk: 'Стабільний внутрішній ідентифікатор. Наприклад: home, services, 404 або about.',
          es: 'Identificador interno estable. Use valores como home, services, 404 o about.',
        },
      },
    },
    {
      name: 'path',
      type: 'text',
      required: true,
      localized: true,
      label: {
        en: 'Public URL Slug',
        uk: 'Публічний slug URL',
        es: 'Slug publico de URL',
      },
      admin: {
        description: {
          en: 'Visible URL segment for this language, for example servicios, about-us or contactos.',
          uk: 'Видимий сегмент URL для цієї мови, наприклад servicios, about-us або kontakty.',
          es: 'Segmento visible de URL para este idioma, por ejemplo servicios, about-us o contactos.',
        },
      },
    },
    seoFields(),
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
            collapsibleField(
              { en: 'Appearance', uk: 'Зовнішній вигляд', es: 'Apariencia' },
              [blockThemeField, buttonStyleField],
              false,
            ),
            collapsibleField(
              { en: 'Content', uk: 'Контент', es: 'Contenido' },
              [
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
              ],
              false,
            ),
            collapsibleField(
              { en: 'Bottom Content & Button', uk: 'Нижній контент і кнопка', es: 'Contenido inferior y boton' },
              [
                {
                  name: 'bottomText',
                  type: 'richText',
                  label: {
                    en: 'Bottom Text',
                    uk: 'Нижній текст',
                    es: 'Texto inferior',
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
            ),
            collapsibleField(
              { en: 'Media', uk: 'Медіа', es: 'Media' },
              [
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
            ),
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
            collapsibleField(
              { en: 'Appearance', uk: 'Зовнішній вигляд', es: 'Apariencia' },
              [blockThemeField, buttonStyleField, sectionSpacingField],
              false,
            ),
            collapsibleField(
              { en: 'Layout', uk: 'Розкладка', es: 'Disposicion' },
              [
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
                incompleteRowAlignmentField,
              ],
            ),
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
            collapsibleField(
              { en: 'Button', uk: 'Кнопка', es: 'Boton' },
              [
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
            ),
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
            collapsibleField(
              { en: 'Appearance', uk: 'Зовнішній вигляд', es: 'Apariencia' },
              [blockThemeField, buttonStyleField],
              false,
            ),
            collapsibleField(
              { en: 'Section Settings', uk: 'Налаштування секції', es: 'Ajustes de seccion' },
              [
                {
                  name: 'sectionTitle',
                  type: 'text',
                  label: {
                    en: 'Section Title',
                    uk: 'Заголовок секції',
                    es: 'Titulo de la seccion',
                  },
                },
              ],
              false,
            ),
            collapsibleField(
              { en: 'Section Button', uk: 'Кнопка секції', es: 'Boton de seccion' },
              [
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
            ),
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
            collapsibleField(
              { en: 'Appearance', uk: 'Зовнішній вигляд', es: 'Apariencia' },
              [blockThemeField, buttonStyleField, sectionSpacingField],
              false,
            ),
            collapsibleField(
              { en: 'Layout', uk: 'Розкладка', es: 'Disposicion' },
              [
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
                incompleteRowAlignmentField,
              ],
            ),
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
            collapsibleField(
              { en: 'Button', uk: 'Кнопка', es: 'Boton' },
              [
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
            ),
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
            collapsibleField(
              { en: 'Appearance', uk: 'Зовнішній вигляд', es: 'Apariencia' },
              [blockThemeField, buttonStyleField],
              false,
            ),
            collapsibleField(
              { en: 'Layout & Source', uk: 'Розкладка і джерело', es: 'Disposicion y fuente' },
              [
                {
                  name: 'position',
                  type: 'select',
                  defaultValue: 'left',
                  options: [
                    { label: { en: 'Image on Left', uk: 'Зображення зліва', es: 'Imagen a la izquierda' }, value: 'left' },
                    { label: { en: 'Image on Right', uk: 'Зображення справа', es: 'Imagen a la derecha' }, value: 'right' },
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
              ],
              false,
            ),
            collapsibleField(
              { en: 'Button', uk: 'Кнопка', es: 'Boton' },
              [
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
            ),
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
            collapsibleField(
              { en: 'Appearance', uk: 'Зовнішній вигляд', es: 'Apariencia' },
              [blockThemeField, buttonStyleField, sectionSpacingField],
              false,
            ),
            collapsibleField(
              { en: 'Layout & Content', uk: 'Розкладка і контент', es: 'Disposicion y contenido' },
              [
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
                {
                  name: 'description',
                  type: 'richText',
                  label: {
                    en: 'Description',
                    uk: 'Опис',
                    es: 'Descripcion',
                  },
                },
              ],
              false,
            ),
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
            collapsibleField(
              { en: 'Button', uk: 'Кнопка', es: 'Boton' },
              [
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
            ),
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
            collapsibleField(
              { en: 'Appearance', uk: 'Зовнішній вигляд', es: 'Apariencia' },
              [blockThemeField, buttonStyleField, sectionSpacingField],
              false,
            ),
            collapsibleField(
              { en: 'Content & Source', uk: 'Контент і джерело', es: 'Contenido y fuente' },
              [
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
              ],
              false,
            ),
            collapsibleField(
              { en: 'Button', uk: 'Кнопка', es: 'Boton' },
              [
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
            ),
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
            collapsibleField(
              { en: 'Appearance', uk: 'Зовнішній вигляд', es: 'Apariencia' },
              [blockThemeField, buttonStyleField, sectionSpacingField],
              false,
            ),
            collapsibleField(
              { en: 'Content', uk: 'Контент', es: 'Contenido' },
              [
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
                  name: 'intro',
                  type: 'richText',
                  label: {
                    en: 'Intro Text',
                    uk: 'Вступний текст',
                    es: 'Texto introductorio',
                  },
                },
                {
                  name: 'splitHeaderLayout',
                  type: 'checkbox',
                  defaultValue: false,
                  label: {
                    en: 'Split header layout (40/60)',
                    uk: 'Розділений header (40/60)',
                    es: 'Encabezado dividido (40/60)',
                  },
                },
                {
                  name: 'summaryTitle',
                  type: 'text',
                  label: {
                    en: 'Reviews Summary Title',
                    uk: 'Заголовок блоку рейтингу',
                    es: 'Titulo del bloque de reseñas',
                  },
                },
                {
                  name: 'reviewsLabel',
                  type: 'text',
                  label: {
                    en: 'Reviews Count Label',
                    uk: 'Підпис до кількості відгуків',
                    es: 'Texto junto a la cantidad de reseñas',
                  },
                },
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
                      en: 'Paste the review widget code or placeholder markup. Leave empty to use default Google Reviews component.',
                      uk: 'Встав код віджета відгуків або тимчасову розмітку. Залиште порожнім, щоб використати стандартний компонент Google Reviews.',
                      es: 'Pegue el codigo del widget de resenas o un marcador temporal. Dejar en blanco para usar el componente de Google Reviews.',
                    },
                  },
                },
                {
                  name: 'desktopSlides',
                  type: 'select',
                  defaultValue: '2',
                  options: [
                    { label: '1', value: '1' },
                    { label: '2', value: '2' },
                    { label: '3', value: '3' },
                    { label: '4', value: '4' },
                  ],
                  label: {
                    en: 'Slides per view (Desktop)',
                    uk: 'Кількість відгуків на ПК',
                    es: 'Reseñas por vista (Escritorio)',
                  },
                  admin: {
                    condition: (_, siblingData) => !siblingData?.embedCode,
                  },
                },
              ],
              false,
            ),
            collapsibleField(
              { en: 'Button', uk: 'Кнопка', es: 'Boton' },
              [
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
            ),
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
            collapsibleField(
              { en: 'Appearance', uk: 'Зовнішній вигляд', es: 'Apariencia' },
              [blockThemeField, buttonStyleField],
              false,
            ),
            collapsibleField(
              { en: 'Layout', uk: 'Розкладка', es: 'Disposicion' },
              [
                {
                  name: 'position',
                  type: 'select',
                  defaultValue: 'left',
                  options: [
                    { label: { en: 'Image on Left', uk: 'Зображення зліва', es: 'Imagen a la izquierda' }, value: 'left' },
                    { label: { en: 'Image on Right', uk: 'Зображення справа', es: 'Imagen a la derecha' }, value: 'right' },
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
                    { label: { en: 'Full width', uk: 'На всю ширину', es: 'Ancho completo' }, value: 'full' },
                    { label: { en: 'Contained', uk: 'У контейнері', es: 'Contenido en contenedor' }, value: 'contained' },
                  ],
                  label: {
                    en: 'Image Width',
                    uk: 'Ширина фото',
                    es: 'Ancho de la imagen',
                  },
                },
              ],
              false,
            ),
            collapsibleField(
              { en: 'Content', uk: 'Контент', es: 'Contenido' },
              [
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
                  name: 'useAsPageTitle',
                  type: 'checkbox',
                  defaultValue: false,
                  label: {
                    en: 'Use title as H1',
                    uk: 'Використати заголовок як H1',
                    es: 'Usar el titulo como H1',
                  },
                  admin: {
                    description: {
                      en: 'Marks this block title as the main page H1. If several blocks are marked, only the first one will be rendered as H1.',
                      uk: 'Позначає цей заголовок як основний H1 сторінки. Якщо позначити кілька блоків, H1 отримає лише перший.',
                      es: 'Marca este titulo como el H1 principal de la pagina. Si se marcan varios bloques, solo el primero se renderizara como H1.',
                    },
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
              false,
            ),
            collapsibleField(
              { en: 'Button', uk: 'Кнопка', es: 'Boton' },
              [
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
            ),
            collapsibleField(
              { en: 'Media', uk: 'Медіа', es: 'Media' },
              [
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
            ),
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
            collapsibleField(
              { en: 'Appearance', uk: 'Зовнішній вигляд', es: 'Apariencia' },
              [blockThemeField],
              false,
            ),
            collapsibleField(
              { en: 'Layout & Source', uk: 'Розкладка і джерело', es: 'Disposicion y fuente' },
              [
                {
                  name: 'position',
                  type: 'select',
                  defaultValue: 'left',
                  options: [
                    { label: { en: 'Image on Left', uk: 'Зображення зліва', es: 'Imagen a la izquierda' }, value: 'left' },
                    { label: { en: 'Image on Right', uk: 'Зображення справа', es: 'Imagen a la derecha' }, value: 'right' },
                  ],
                  label: {
                    en: 'Image Position',
                    uk: 'Позиція зображення',
                    es: 'Posicion de la imagen',
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
              false,
            ),
            collapsibleField(
              { en: 'Media', uk: 'Медіа', es: 'Media' },
              [
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
            ),
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
            collapsibleField(
              { en: 'Appearance', uk: 'Зовнішній вигляд', es: 'Apariencia' },
              [blockThemeField, buttonStyleField, sectionSpacingField],
              false,
            ),
            collapsibleField(
              { en: 'Content', uk: 'Контент', es: 'Contenido' },
              [
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
                  name: 'useAsPageTitle',
                  type: 'checkbox',
                  defaultValue: false,
                  label: {
                    en: 'Use title as H1',
                    uk: 'Використати заголовок як H1',
                    es: 'Usar el titulo como H1',
                  },
                  admin: {
                    description: {
                      en: 'Marks this block title as the main page H1. If several blocks are marked, only the first one will be rendered as H1.',
                      uk: 'Позначає цей заголовок як основний H1 сторінки. Якщо позначити кілька блоків, H1 отримає лише перший.',
                      es: 'Marca este titulo como el H1 principal de la pagina. Si se marcan varios bloques, solo el primero se renderizara como H1.',
                    },
                  },
                },
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
                  name: 'fullWidthContent',
                  type: 'checkbox',
                  defaultValue: false,
                  label: {
                    en: 'Stretch content to container width',
                    uk: 'Розтягнути контент на всю ширину контейнера',
                    es: 'Extender el contenido al ancho del contenedor',
                  },
                },
              ],
              false,
            ),
            collapsibleField(
              { en: 'Bottom Content', uk: 'Нижній контент', es: 'Contenido inferior' },
              [
                {
                  name: 'bottomText',
                  type: 'richText',
                  label: {
                    en: 'Bottom Text',
                    uk: 'Нижній текст',
                    es: 'Texto inferior',
                  },
                },
              ],
            ),
            collapsibleField(
              { en: 'Background', uk: 'Фон', es: 'Fondo' },
              [
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
              ],
            ),
            collapsibleField(
              { en: 'Button', uk: 'Кнопка', es: 'Boton' },
              [
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
            ),
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
          fields: [
            collapsibleField(
              { en: 'Appearance', uk: 'Зовнішній вигляд', es: 'Apariencia' },
              [blockThemeField, sectionSpacingField],
              false,
            ),
          ],
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
            collapsibleField(
              { en: 'Appearance', uk: 'Зовнішній вигляд', es: 'Apariencia' },
              [blockThemeField, sectionSpacingField],
              false,
            ),
            collapsibleField(
              { en: 'Section Content', uk: 'Контент секції', es: 'Contenido de la seccion' },
              [
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
              ],
              false,
            ),
            collapsibleField(
              { en: 'Placeholders', uk: 'Плейсхолдери', es: 'Placeholders' },
              [
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
              ],
            ),
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
