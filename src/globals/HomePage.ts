import { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Головний екран',
      fields: [
        { name: 'title', type: 'textarea', localized: true, required: true },
        { name: 'subtitle', type: 'text', localized: true },
        { name: 'buttonText', type: 'text', localized: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'advantages',
      type: 'array',
      label: 'Переваги (Diagnóstico honesto, тощо)',
      localized: true,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'icon', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}