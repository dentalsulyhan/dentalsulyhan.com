import type { CollectionConfig } from 'payload'

import {
  buildMediaPrefix,
  DEFAULT_MEDIA_CATEGORY,
  isMediaCategory,
  normalizeMediaFilename,
  withNumericFilenameSuffix,
} from './mediaUploadUtils'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: {
      en: 'Media',
      uk: 'Медіафайл',
      es: 'Medio',
    },
    plural: {
      en: 'Media Library',
      uk: 'Медіафайли',
      es: 'Medios',
    },
  },
  admin: {
    group: {
      en: 'Content',
      uk: 'Контент',
      es: 'Contenido',
    },
    defaultColumns: ['filename', 'mediaCategory', 'prefix', 'alt', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeOperation: [
      async ({ args, req, operation }) => {
        if (!req.file?.name) {
          return args
        }

        const data =
          'data' in args && args.data && typeof args.data === 'object'
            ? (args.data as Record<string, unknown>)
            : undefined

        const incomingCategory = data?.mediaCategory
        const mediaCategory = isMediaCategory(incomingCategory) ? incomingCategory : DEFAULT_MEDIA_CATEGORY

        const baseFilename = normalizeMediaFilename(req.file.name, mediaCategory)
        const currentDocId =
          operation === 'update' && 'id' in args && (typeof args.id === 'number' || typeof args.id === 'string')
            ? args.id
            : null

        let nextFilename = baseFilename
        let suffix = 0

        while (true) {
          const existing = await req.payload.find({
            collection: 'media',
            depth: 0,
            limit: 1,
            pagination: false,
            where: {
              filename: {
                equals: nextFilename,
              },
            },
          })

          const existingDoc = existing.docs[0]

          if (!existingDoc || (currentDocId !== null && String(existingDoc.id) === String(currentDocId))) {
            break
          }

          suffix += 1
          nextFilename = withNumericFilenameSuffix(baseFilename, suffix)
        }

        req.file.name = nextFilename

        return {
          ...args,
          data: {
            ...(data || {}),
            mediaCategory,
            prefix:
              typeof data?.prefix === 'string' && data.prefix.trim()
                ? data.prefix
                : buildMediaPrefix(mediaCategory),
          },
        }
      },
    ],
  },
  fields: [
    {
      name: 'mediaCategory',
      type: 'select',
      defaultValue: DEFAULT_MEDIA_CATEGORY,
      options: [
        {
          label: {
            en: 'General',
            uk: 'Загальні',
            es: 'General',
          },
          value: 'general',
        },
        {
          label: {
            en: 'Site',
            uk: 'Сайт',
            es: 'Sitio',
          },
          value: 'site',
        },
        {
          label: {
            en: 'Services',
            uk: 'Послуги',
            es: 'Servicios',
          },
          value: 'services',
        },
        {
          label: {
            en: 'Team',
            uk: 'Команда',
            es: 'Equipo',
          },
          value: 'team',
        },
        {
          label: {
            en: 'Promotions',
            uk: 'Акції',
            es: 'Promociones',
          },
          value: 'promotions',
        },
        {
          label: {
            en: 'Blog',
            uk: 'Блог',
            es: 'Blog',
          },
          value: 'blog',
        },
        {
          label: {
            en: 'Branding',
            uk: 'Брендинг',
            es: 'Branding',
          },
          value: 'branding',
        },
      ],
      label: {
        en: 'Media Category',
        uk: 'Категорія файлу',
        es: 'Categoría del archivo',
      },
    },
    {
      name: 'prefix',
      type: 'text',
      label: {
        en: 'Storage Path',
        uk: 'Шлях зберігання',
        es: 'Ruta de almacenamiento',
      },
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: {
        en: 'Alt Text',
        uk: 'Альтернативний текст',
        es: 'Texto alternativo',
      },
    },
  ],
  upload: {
    staticDir: 'public/media',
  },
}
