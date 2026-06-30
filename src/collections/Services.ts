import type { CollectionConfig, Field } from 'payload'
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

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: {
      en: 'Service',
      uk: 'Послуга',
      es: 'Servicio',
    },
    plural: {
      en: 'Services',
      uk: 'Послуги',
      es: 'Servicios',
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
        en: 'Service Name',
        uk: 'Назва послуги',
        es: 'Nombre del servicio',
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
          en: 'Stable internal identifier for linking and imports.',
          uk: 'Стабільний внутрішній ідентифікатор для звʼязків та імпорту.',
          es: 'Identificador interno estable para enlaces e importaciones.',
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
          en: 'Visible URL segment for this language, for example dental-implants.',
          uk: 'Видимий сегмент URL для цієї мови, наприклад dental-implants.',
          es: 'Segmento visible de URL para este idioma, por ejemplo implantes-dentales.',
        },
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      localized: true,
      label: {
        en: 'Service Page Layout',
        uk: 'Конструктор сторінки послуги',
        es: 'Constructor de la pagina del servicio',
      },
      blocks: [
        {
          slug: 'hero',
          labels: {
            singular: {
              en: 'Hero',
              uk: 'Головний блок',
              es: 'Hero',
            },
            plural: {
              en: 'Hero Blocks',
              uk: 'Головні блоки',
              es: 'Bloques hero',
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
          slug: 'content',
          labels: {
            singular: {
              en: 'Text Section',
              uk: 'Текстовий блок',
              es: 'Bloque de texto',
            },
            plural: {
              en: 'Text Sections',
              uk: 'Текстові блоки',
              es: 'Bloques de texto',
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
                  name: 'content',
                  type: 'richText',
                  label: {
                    en: 'Content',
                    uk: 'Контент',
                    es: 'Contenido',
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
              ],
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
                  name: 'text',
                  type: 'richText',
                  required: true,
                  label: {
                    en: 'Text',
                    uk: 'Текст',
                    es: 'Texto',
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
              { en: 'Layout & Intro', uk: 'Розкладка і вступ', es: 'Disposicion e introduccion' },
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
                  name: 'subtitle',
                  type: 'richText',
                  label: {
                    en: 'Intro Text',
                    uk: 'Вступний текст',
                    es: 'Texto introductorio',
                  },
                },
                {
                  name: 'fullWidthText',
                  type: 'checkbox',
                  defaultValue: false,
                  label: {
                    en: 'Stretch intro and bottom text to container width',
                    uk: 'Розтягнути верхній і нижній текст на всю ширину контейнера',
                    es: 'Extender el texto superior e inferior al ancho del contenedor',
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
                {
                  name: 'columns',
                  type: 'select',
                  defaultValue: '3',
                  options: [
                    {
                      label: {
                        en: '2 columns',
                        uk: '2 колонки',
                        es: '2 columnas',
                      },
                      value: '2',
                    },
                    {
                      label: {
                        en: '3 columns',
                        uk: '3 колонки',
                        es: '3 columnas',
                      },
                      value: '3',
                    },
                    {
                      label: {
                        en: '4 columns',
                        uk: '4 колонки',
                        es: '4 columnas',
                      },
                      value: '4',
                    },
                  ],
                  label: {
                    en: 'Desktop Columns',
                    uk: 'Кількість колонок на десктопі',
                    es: 'Columnas en desktop',
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
                  label: {
                    en: 'Title',
                    uk: 'Заголовок',
                    es: 'Titulo',
                  },
                },
                {
                  name: 'text',
                  type: 'richText',
                  label: {
                    en: 'Text',
                    uk: 'Текст',
                    es: 'Texto',
                  },
                },
              ],
            },
            collapsibleField(
              { en: 'Bottom Content & Button', uk: 'Нижній контент і кнопка', es: 'Contenido inferior y boton' },
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
          slug: 'cards',
          labels: {
            singular: {
              en: 'Cards',
              uk: 'Картки',
              es: 'Tarjetas',
            },
            plural: {
              en: 'Cards Blocks',
              uk: 'Блоки карток',
              es: 'Bloques de tarjetas',
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
                {
                  name: 'columns',
              type: 'select',
              defaultValue: '4',
              options: [
                {
                  label: {
                    en: '2 columns',
                    uk: '2 колонки',
                    es: '2 columnas',
                  },
                  value: '2',
                },
                {
                  label: {
                    en: '3 columns',
                    uk: '3 колонки',
                    es: '3 columnas',
                  },
                  value: '3',
                },
                {
                  label: {
                    en: '4 columns',
                    uk: '4 колонки',
                    es: '4 columnas',
                  },
                  value: '4',
                },
              ],
              label: {
                en: 'Desktop Columns',
                uk: 'Кількість колонок на десктопі',
                es: 'Columnas en desktop',
              },
            },
                incompleteRowAlignmentField,
                {
                  name: 'intro',
                  type: 'richText',
                  label: {
                    en: 'Intro Text',
                    uk: 'Вступний текст',
                    es: 'Texto introductorio',
                  },
                },
              ],
              false,
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
                  label: {
                    en: 'Title',
                    uk: 'Заголовок',
                    es: 'Titulo',
                  },
                },
                {
                  name: 'text',
                  type: 'richText',
                  label: {
                    en: 'Text',
                    uk: 'Текст',
                    es: 'Texto',
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
          ],
        },
        {
          slug: 'steps',
          labels: {
            singular: {
              en: 'Steps',
              uk: 'Кроки',
              es: 'Pasos',
            },
            plural: {
              en: 'Steps Blocks',
              uk: 'Блоки кроків',
              es: 'Bloques de pasos',
            },
          },
          fields: [
            collapsibleField(
              { en: 'Appearance', uk: 'Зовнішній вигляд', es: 'Apariencia' },
              [blockThemeField, sectionSpacingField],
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
                  name: 'fullWidthText',
                  type: 'checkbox',
                  defaultValue: false,
                  label: {
                    en: 'Stretch intro and bottom text to container width',
                    uk: 'Розтягнути верхній і нижній текст на всю ширину контейнера',
                    es: 'Extender el texto superior e inferior al ancho del contenedor',
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
                  en: 'Step',
                  uk: 'Крок',
                  es: 'Paso',
                },
                plural: {
                  en: 'Steps',
                  uk: 'Кроки',
                  es: 'Pasos',
                },
              },
              fields: [
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
                },
              ],
            },
          ],
        },
        {
          slug: 'faq',
          labels: {
            singular: {
              en: 'FAQ',
              uk: 'FAQ',
              es: 'FAQ',
            },
            plural: {
              en: 'FAQ Blocks',
              uk: 'Блоки FAQ',
              es: 'Bloques FAQ',
            },
          },
          fields: [
            collapsibleField(
              { en: 'Appearance', uk: 'Зовнішній вигляд', es: 'Apariencia' },
              [blockThemeField, sectionSpacingField],
              false,
            ),
            collapsibleField(
              { en: 'Layout & Intro', uk: 'Розкладка і вступ', es: 'Disposicion e introduccion' },
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
                  name: 'columns',
                  type: 'select',
                  defaultValue: 'one',
                  options: [
                    {
                      label: {
                        en: 'One column',
                        uk: 'Одна колонка',
                        es: 'Una columna',
                      },
                      value: 'one',
                    },
                    {
                      label: {
                        en: 'Two columns',
                        uk: 'Дві колонки',
                        es: 'Dos columnas',
                      },
                      value: 'two',
                    },
                  ],
                  label: {
                    en: 'Layout',
                    uk: 'Розкладка',
                    es: 'Disposicion',
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
                  en: 'Question',
                  uk: 'Питання',
                  es: 'Pregunta',
                },
                plural: {
                  en: 'Questions',
                  uk: 'Питання',
                  es: 'Preguntas',
                },
              },
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  required: true,
                  label: {
                    en: 'Question',
                    uk: 'Питання',
                    es: 'Pregunta',
                  },
                },
                {
                  name: 'content',
                  type: 'richText',
                  required: true,
                  label: {
                    en: 'Answer',
                    uk: 'Відповідь',
                    es: 'Respuesta',
                  },
                },
              ],
            },
          ],
        },
        {
          slug: 'comparison',
          labels: {
            singular: {
              en: 'Comparison',
              uk: 'Порівняння',
              es: 'Comparacion',
            },
            plural: {
              en: 'Comparison Blocks',
              uk: 'Блоки порівняння',
              es: 'Bloques de comparacion',
            },
          },
          fields: [
            collapsibleField(
              { en: 'Appearance', uk: 'Зовнішній вигляд', es: 'Apariencia' },
              [blockThemeField, sectionSpacingField],
              false,
            ),
            collapsibleField(
              { en: 'Layout & Intro', uk: 'Розкладка і вступ', es: 'Disposicion e introduccion' },
              [
                {
                  name: 'layoutStyle',
                  type: 'select',
                  defaultValue: 'cards',
                  options: [
                    {
                      label: {
                        en: 'Cards',
                        uk: 'Картки',
                        es: 'Tarjetas',
                      },
                      value: 'cards',
                    },
                    {
                      label: {
                        en: 'Split columns on background',
                        uk: 'Колонки на фоні',
                        es: 'Columnas sobre fondo',
                      },
                      value: 'split',
                    },
                  ],
                  label: {
                    en: 'Style',
                    uk: 'Стиль',
                    es: 'Estilo',
                  },
                },
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
              ],
              false,
            ),
            collapsibleField(
              { en: 'Background Overlay', uk: 'Фон і оверлей', es: 'Fondo y overlay' },
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
                },
              ],
            ),
            collapsibleField(
              { en: 'Columns Content', uk: 'Контент колонок', es: 'Contenido de columnas' },
              [
                {
                  name: 'leftColumnTitle',
                  type: 'text',
                  required: true,
                  label: {
                    en: 'Left Column Title',
                    uk: 'Заголовок лівої колонки',
                    es: 'Titulo de la columna izquierda',
                  },
                },
                {
                  name: 'leftContent',
                  type: 'richText',
                  required: true,
                  label: {
                    en: 'Left Column Content',
                    uk: 'Контент лівої колонки',
                    es: 'Contenido de la columna izquierda',
                  },
                },
                {
                  name: 'rightColumnTitle',
                  type: 'text',
                  required: true,
                  label: {
                    en: 'Right Column Title',
                    uk: 'Заголовок правої колонки',
                    es: 'Titulo de la columna derecha',
                  },
                },
                {
                  name: 'rightContent',
                  type: 'richText',
                  required: true,
                  label: {
                    en: 'Right Column Content',
                    uk: 'Контент правої колонки',
                    es: 'Contenido de la columna derecha',
                  },
                },
              ],
              false,
            ),
            collapsibleField(
              { en: 'Bottom Content', uk: 'Нижній контент', es: 'Contenido inferior' },
              [
                {
                  name: 'conclusion',
                  type: 'richText',
                  label: {
                    en: 'Bottom Text',
                    uk: 'Нижній текст',
                    es: 'Texto inferior',
                  },
                },
              ],
            ),
          ],
        },
        {
          slug: 'contentAccordion',
          labels: {
            singular: {
              en: 'Image + Accordion',
              uk: 'Фото + акордеон',
              es: 'Imagen + acordeon',
            },
            plural: {
              en: 'Image + Accordion Blocks',
              uk: 'Блоки фото + акордеон',
              es: 'Bloques imagen + acordeon',
            },
          },
          fields: [
            collapsibleField(
              { en: 'Appearance', uk: 'Зовнішній вигляд', es: 'Apariencia' },
              [blockThemeField],
              false,
            ),
            collapsibleField(
              { en: 'Layout & Intro', uk: 'Розкладка і вступ', es: 'Disposicion e introduccion' },
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
                  name: 'title',
                  type: 'text',
                  label: {
                    en: 'Title',
                    uk: 'Заголовок',
                    es: 'Titulo',
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
                  en: 'Item',
                  uk: 'Пункт',
                  es: 'Elemento',
                },
                plural: {
                  en: 'Items',
                  uk: 'Пункти',
                  es: 'Elementos',
                },
              },
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  required: true,
                  label: {
                    en: 'Heading',
                    uk: 'Заголовок',
                    es: 'Titulo',
                  },
                },
                {
                  name: 'content',
                  type: 'richText',
                  required: true,
                  label: {
                    en: 'Content',
                    uk: 'Контент',
                    es: 'Contenido',
                  },
                },
              ],
            },
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
          ],
        },
        {
          slug: 'cta',
          labels: {
            singular: {
              en: 'CTA',
              uk: 'CTA',
              es: 'CTA',
            },
            plural: {
              en: 'CTA Blocks',
              uk: 'Блоки CTA',
              es: 'Bloques CTA',
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
                  type: 'text',
                  label: {
                    en: 'Title',
                    uk: 'Заголовок',
                    es: 'Titulo',
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
                },
              ],
              false,
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
      ],
    },
  ],
}
