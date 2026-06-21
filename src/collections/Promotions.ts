import { CollectionConfig } from 'payload'

export const Promotions: CollectionConfig = {
  slug: 'promotions',
  admin: { useAsTitle: 'title' },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'validUntil',
      type: 'date',
      label: 'Акція діє до:',
      required: true,
      admin: {
        date: {
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}