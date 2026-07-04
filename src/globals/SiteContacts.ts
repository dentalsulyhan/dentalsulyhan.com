import { GlobalConfig } from 'payload'

export const SiteContacts: GlobalConfig = {
  slug: 'site-contacts',
  label: {
    en: 'Site Contacts',
    uk: 'Контактні дані сайту',
    es: 'Contactos del sitio',
  },
  admin: {
    hidden: true,
    group: {
      en: 'Legacy',
      uk: 'Legacy',
      es: 'Legacy',
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'email',
      type: 'text',
      label: {
        en: 'Email',
        uk: 'Email',
        es: 'Email',
      },
      defaultValue: 'clinica@dentalsulyhan.com',
    },
    {
      name: 'phone',
      type: 'text',
      label: {
        en: 'Phone Number',
        uk: 'Номер телефону',
        es: 'Número de teléfono',
      },
      defaultValue: '+34 665-399-280',
    },
    {
      name: 'whatsapp',
      type: 'text',
      label: {
        en: 'WhatsApp Link',
        uk: 'Посилання на WhatsApp',
        es: 'Enlace de WhatsApp',
      },
      defaultValue: 'https://wa.me/+34665399280',
    },
    {
      name: 'telegram',
      type: 'text',
      label: {
        en: 'Telegram Link',
        uk: 'Посилання на Telegram',
        es: 'Enlace de Telegram',
      },
      defaultValue: 'https://t.me/+34665399280',
    },
    {
      name: 'address',
      type: 'text',
      localized: true,
      label: {
        en: 'Address',
        uk: 'Адреса',
        es: 'Dirección',
      },
      defaultValue: 'Juan de Garay, 30, 46017, Valencia',
    },
    {
      name: 'transport',
      type: 'text',
      localized: true,
      label: {
        en: 'Public Transport',
        uk: 'Громадський транспорт',
        es: 'Transporte público',
      },
      defaultValue: 'Metro Safranar: Líneas – 1 → 2 → 7',
    },
    {
      name: 'socialLinks',
      type: 'array',
      admin: {
        components: {
          RowLabel: '/components/admin/TitleRowLabel#TitleRowLabel',
        },
      },
      label: {
        en: 'Social Media Links',
        uk: 'Соціальні мережі',
        es: 'Redes sociales',
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          label: {
            en: 'Platform',
            uk: 'Платформа',
            es: 'Plataforma',
          },
          required: true,
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'TikTok', value: 'tiktok' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          label: {
            en: 'URL',
            uk: 'Посилання',
            es: 'Enlace',
          },
          required: true,
        },
      ],
    },
    {
      name: 'googleMapsUrl',
      type: 'text',
      label: {
        en: 'Google Maps Embed URL',
        uk: 'Google Maps URL для вбудовування',
        es: 'URL de Google Maps para insertar',
      },
      admin: {
        description: {
          en: 'Optional: paste Google Maps embed URL for the contact section map',
          uk: 'Необовʼязково: вставте URL Google Maps для карти на сторінці контактів',
          es: 'Opcional: pegue la URL de Google Maps para el mapa de contacto',
        },
      },
    },
  ],
}
