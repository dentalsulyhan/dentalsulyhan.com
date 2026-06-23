import type { CollectionConfig } from 'payload'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: {
    singular: {
      en: 'Team Member',
      uk: 'Член команди',
      es: 'Miembro del equipo',
    },
    plural: {
      en: 'Team Members',
      uk: 'Команда',
      es: 'Equipo',
    },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'position', 'order'],
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
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: {
        en: 'Full Name',
        uk: 'Повне ім\'я',
        es: 'Nombre completo',
      },
    },
    {
      name: 'position',
      type: 'text',
      required: true,
      localized: true,
      label: {
        en: 'Position',
        uk: 'Посада',
        es: 'Cargo',
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
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: {
        en: 'Photo',
        uk: 'Фото',
        es: 'Foto',
      },
    },
    {
      name: 'photoHover',
      type: 'upload',
      relationTo: 'media',
      label: {
        en: 'Hover Photo',
        uk: 'Фото при наведенні',
        es: 'Foto al pasar el cursor',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: {
        en: 'Sort Order',
        uk: 'Порядок сортування',
        es: 'Orden',
      },
      admin: {
        description: {
          en: 'Lower numbers appear first',
          uk: 'Менші числа відображаються першими',
          es: 'Los números más bajos aparecen primero',
        },
      },
    },
  ],
}
