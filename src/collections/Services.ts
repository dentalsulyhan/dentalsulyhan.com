import { CollectionConfig } from 'payload'

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
    read: () => true, // Відкриваємо доступ для читання фронтенду
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true, // Локалізуємо назву (es, en, uk)
      label: {
        en: 'Service Name',
        uk: 'Назва послуги',
        es: 'Nombre del Servicio',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true, // Наприклад: 'implants', 'veneers'
      label: {
        en: 'Slug (URL path, e.g. implants)',
        uk: 'Slug (частина URL-адреси, напр. implants)',
        es: 'Slug (Ruta URL, ej. implants)',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      localized: true, // Локалізуємо весь контент сторінки
      label: {
        en: 'Page Layout Builder',
        uk: 'Конструктор сторінки',
        es: 'Constructor de Diseño de Página',
      },
      blocks: [
        // БЛОК 1: Шахматка (Текст + Фото)
        {
          slug: 'contentImage',
          labels: {
            singular: {
              en: 'Text + Image',
              uk: 'Текст + Фото',
              es: 'Texto + Imagen',
            },
            plural: {
              en: 'Text + Image Blocks',
              uk: 'Блоки Текст + Фото',
              es: 'Bloques de Texto + Imagen',
            },
          },
          fields: [
            {
              name: 'position',
              type: 'select',
              label: {
                en: 'Image Position',
                uk: 'Розташування фото',
                es: 'Posición de la Imagen',
              },
              options: [
                {
                  label: {
                    en: 'Image on Left',
                    uk: 'Фото зліва',
                    es: 'Imagen a la izquierda',
                  },
                  value: 'left',
                },
                {
                  label: {
                    en: 'Image on Right',
                    uk: 'Фото справа',
                    es: 'Imagen a la derecha',
                  },
                  value: 'right',
                },
              ],
              defaultValue: 'left',
            },
            {
              name: 'imageWidth',
              type: 'select',
              defaultValue: 'full',
              label: {
                en: 'Image Width',
                uk: 'Ширина фото',
                es: 'Ancho de la imagen',
              },
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
            },
            {
              name: 'text',
              type: 'richText',
              required: true,
              label: {
                en: 'Text Content',
                uk: 'Текстовий контент',
                es: 'Contenido de texto',
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
        // БЛОК 2: Акордеон (для довгих описів чи FAQ)
        {
          slug: 'accordion',
          labels: {
            singular: {
              en: 'Accordion Item',
              uk: 'Елемент акордеону',
              es: 'Elemento de Acordeón',
            },
            plural: {
              en: 'Accordion Items',
              uk: 'Елементи акордеону',
              es: 'Elementos de Acordeón',
            },
          },
          fields: [
            {
              name: 'heading',
              type: 'text',
              required: true,
              label: {
                en: 'Item Heading',
                uk: 'Заголовок пункту',
                es: 'Encabezado del elemento',
              },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              label: {
                en: 'Hidden Content',
                uk: 'Прихований текст',
                es: 'Contenido oculto',
              },
            },
          ],
        },
      ],
    },
  ],
}
