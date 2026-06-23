import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: {
      en: 'User',
      uk: 'Користувач',
      es: 'Usuario',
    },
    plural: {
      en: 'Users',
      uk: 'Користувачі',
      es: 'Usuarios',
    },
  },
  admin: {
    useAsTitle: 'email',
    group: {
      en: 'System',
      uk: 'Система',
      es: 'Sistema',
    },
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
