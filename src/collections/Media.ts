import type { CollectionConfig } from 'payload'

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
  access: {
    read: () => true,
  },
  fields: [
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
