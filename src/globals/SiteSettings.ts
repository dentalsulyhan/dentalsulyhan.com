import type { GlobalConfig } from 'payload'
import { normalizeLexicalValue } from '@/lib/lexical'

function normalizeFormNotificationEditors<T extends Record<string, unknown> | null | undefined>(doc: T): T {
  if (!doc || typeof doc !== 'object') return doc

  const value = doc as Record<string, unknown>
  const contacts =
    value.contacts && typeof value.contacts === 'object' ? (value.contacts as Record<string, unknown>) : null
  const formNotifications =
    value.formNotifications && typeof value.formNotifications === 'object'
      ? (value.formNotifications as Record<string, unknown>)
      : null

  if (contacts && 'sectionDescription' in contacts) {
    contacts.sectionDescription = normalizeLexicalValue(contacts.sectionDescription)
  }

  if (!formNotifications) return doc

  if ('adminMessage' in formNotifications) {
    formNotifications.adminMessage = normalizeLexicalValue(formNotifications.adminMessage)
  }

  if ('userMessage' in formNotifications) {
    formNotifications.userMessage = normalizeLexicalValue(formNotifications.userMessage)
  }

  return doc
}

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: {
    en: 'Site Settings',
    uk: 'Налаштування сайту',
    es: 'Configuracion del sitio',
  },
  admin: {
    group: {
      en: 'Settings',
      uk: 'Налаштування',
      es: 'Configuracion',
    },
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterRead: [
      ({ doc }) => {
        return normalizeFormNotificationEditors(doc)
      },
    ],
    beforeChange: [
      ({ data }) => {
        return normalizeFormNotificationEditors(data)
      },
    ],
  },
  fields: [
    {
      name: 'menuItems',
      type: 'array',
      admin: {
        components: {
          RowLabel: '/components/admin/TitleRowLabel#TitleRowLabel',
        },
      },
      label: {
        en: 'Shared Menu Items',
        uk: 'Спільні пункти меню',
        es: 'Elementos compartidos del menu',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          label: {
            en: 'Label',
            uk: 'Назва',
            es: 'Etiqueta',
          },
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          label: {
            en: 'Link',
            uk: 'Посилання',
            es: 'Enlace',
          },
          admin: {
            description: {
              en: 'Use /services for pages or #contact_us for anchors',
              uk: 'Використовуйте /services для сторінок або #contact_us для якорів',
              es: 'Use /services para paginas o #contact_us para anclas',
            },
          },
        },
      ],
    },
    {
      name: 'header',
      type: 'group',
      label: {
        en: 'Header Settings',
        uk: 'Налаштування хедера',
        es: 'Configuracion del header',
      },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: {
            en: 'Header Logo',
            uk: 'Логотип хедера',
            es: 'Logo del header',
          },
        },
        {
          name: 'menuButtonLabel',
          type: 'text',
          localized: true,
          defaultValue: 'Menu',
          label: {
            en: 'Menu Button Label',
            uk: 'Текст кнопки меню',
            es: 'Texto del boton menu',
          },
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      label: {
        en: 'Footer Settings',
        uk: 'Налаштування футера',
        es: 'Configuracion del footer',
      },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: {
            en: 'Footer Logo',
            uk: 'Логотип футера',
            es: 'Logo del footer',
          },
        },
        {
          name: 'copyright',
          type: 'text',
          localized: true,
          defaultValue: '©2024 - All right reserved',
          label: {
            en: 'Copyright Text',
            uk: 'Копірайт',
            es: 'Texto de copyright',
          },
        },
      ],
    },
    {
      name: 'contacts',
      type: 'group',
      label: {
        en: 'Contact Block',
        uk: 'Блок контактів',
        es: 'Bloque de contacto',
      },
      fields: [
        {
          name: 'sectionTitle',
          type: 'text',
          localized: true,
          label: {
            en: 'Section Title',
            uk: 'Заголовок секції',
            es: 'Titulo de la seccion',
          },
        },
        {
          name: 'sectionDescription',
          type: 'richText',
          localized: true,
          label: {
            en: 'Section Description',
            uk: 'Опис секції',
            es: 'Descripcion de la seccion',
          },
        },
        {
          name: 'phoneLabel',
          type: 'text',
          localized: true,
          label: {
            en: 'Phone Label',
            uk: 'Підпис для телефону',
            es: 'Etiqueta del telefono',
          },
        },
        {
          name: 'emailLabel',
          type: 'text',
          localized: true,
          label: {
            en: 'Email Label',
            uk: 'Підпис для email',
            es: 'Etiqueta del email',
          },
        },
        {
          name: 'addressLabel',
          type: 'text',
          localized: true,
          label: {
            en: 'Address Label',
            uk: 'Підпис для адреси',
            es: 'Etiqueta de la direccion',
          },
        },
        {
          name: 'transportLabel',
          type: 'text',
          localized: true,
          label: {
            en: 'Transport Label',
            uk: 'Підпис для транспорту',
            es: 'Etiqueta del transporte',
          },
        },
        {
          name: 'socialLabel',
          type: 'text',
          localized: true,
          label: {
            en: 'Social Label',
            uk: 'Підпис для соцмереж',
            es: 'Etiqueta de redes sociales',
          },
        },
        {
          name: 'email',
          type: 'text',
          defaultValue: 'clinica@dentalsulyhan.com',
          label: {
            en: 'Email',
            uk: 'Email',
            es: 'Email',
          },
        },
        {
          name: 'phone',
          type: 'text',
          defaultValue: '+34 665-399-280',
          label: {
            en: 'Phone',
            uk: 'Телефон',
            es: 'Telefono',
          },
        },
        {
          name: 'whatsapp',
          type: 'text',
          defaultValue: 'https://wa.me/+34665399280',
          label: {
            en: 'WhatsApp Link',
            uk: 'Посилання WhatsApp',
            es: 'Enlace de WhatsApp',
          },
        },
        {
          name: 'telegram',
          type: 'text',
          defaultValue: 'https://t.me/+34665399280',
          label: {
            en: 'Telegram Link',
            uk: 'Посилання Telegram',
            es: 'Enlace de Telegram',
          },
        },
        {
          name: 'address',
          type: 'text',
          localized: true,
          defaultValue: 'Juan de Garay, 30, 46017, Valencia',
          label: {
            en: 'Address',
            uk: 'Адреса',
            es: 'Direccion',
          },
        },
        {
          name: 'transport',
          type: 'text',
          localized: true,
          defaultValue: 'Metro Safranar: Lineas – 1 → 2 → 7',
          label: {
            en: 'Public Transport',
            uk: 'Громадський транспорт',
            es: 'Transporte publico',
          },
        },
        {
          name: 'googleMapsUrl',
          type: 'text',
          label: {
            en: 'Google Maps Embed URL',
            uk: 'Google Maps URL для вбудовування',
            es: 'URL de Google Maps para insertar',
          },
        },
      ],
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
          required: true,
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'TikTok', value: 'tiktok' },
          ],
          label: {
            en: 'Platform',
            uk: 'Платформа',
            es: 'Plataforma',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: {
            en: 'URL',
            uk: 'Посилання',
            es: 'Enlace',
          },
        },
      ],
    },
    {
      name: 'globalContactSection',
      type: 'group',
      label: {
        en: 'Contact Form',
        uk: 'Форма контактів',
        es: 'Formulario de contacto',
      },
      fields: [
        {
          name: 'sectionTitle',
          type: 'text',
          localized: true,
          admin: {
            hidden: true,
          },
          label: {
            en: 'Section Title',
            uk: 'Заголовок секції',
            es: 'Titulo de la seccion',
          },
        },
        {
          name: 'sectionDescription',
          type: 'richText',
          localized: true,
          admin: {
            hidden: true,
          },
          label: {
            en: 'Section Description',
            uk: 'Опис секції',
            es: 'Descripcion de la seccion',
          },
        },
        {
          name: 'formTitle',
          type: 'text',
          localized: true,
          label: {
            en: 'Form Title',
            uk: 'Заголовок форми',
            es: 'Titulo del formulario',
          },
        },
        {
          name: 'formDescription',
          type: 'richText',
          localized: true,
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
          name: 'patientTypes',
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
          name: 'refSources',
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
      ],
    },
    {
      name: 'formNotifications',
      type: 'group',
      label: {
        en: 'Form Notifications',
        uk: 'Сповіщення форми',
        es: 'Notificaciones del formulario',
      },
      fields: [
        {
          name: 'recipientEmail',
          type: 'text',
          label: {
            en: 'Recipient Email',
            uk: 'Email отримувача',
            es: 'Email del destinatario',
          },
          admin: {
            description: {
              en: 'Where contact form submissions should be sent.',
              uk: 'Куди надсилати заявки з форми.',
              es: 'A donde enviar las solicitudes del formulario.',
            },
          },
        },
        {
          name: 'sendConfirmationToUser',
          type: 'checkbox',
          defaultValue: true,
          label: {
            en: 'Send Confirmation To User',
            uk: 'Надсилати підтвердження користувачу',
            es: 'Enviar confirmacion al usuario',
          },
        },
        {
          name: 'availablePlaceholdersNote',
          type: 'ui',
          admin: {
            components: {
              Field: '/components/admin/FormPlaceholdersNote#FormPlaceholdersNote',
            },
          },
        },
        {
          name: 'adminSubject',
          type: 'text',
          localized: true,
          label: {
            en: 'Admin Email Subject',
            uk: 'Тема листа адміну',
            es: 'Asunto del email al administrador',
          },
        },
        {
          name: 'adminMessage',
          type: 'richText',
          localized: true,
          admin: {
            description: {
              en: 'Use the editor for bold, italic, lists and links.',
              uk: 'Використовуйте редактор для жирного, курсиву, списків і посилань.',
              es: 'Use el editor para negrita, cursiva, listas y enlaces.',
            },
          },
          label: {
            en: 'Admin Email Message',
            uk: 'Текст листа адміну',
            es: 'Mensaje del email al administrador',
          },
        },
        {
          name: 'userSubject',
          type: 'text',
          localized: true,
          label: {
            en: 'User Email Subject',
            uk: 'Тема листа користувачу',
            es: 'Asunto del email al usuario',
          },
        },
        {
          name: 'userMessage',
          type: 'richText',
          localized: true,
          admin: {
            description: {
              en: 'Use the editor for bold, italic, lists and links.',
              uk: 'Використовуйте редактор для жирного, курсиву, списків і посилань.',
              es: 'Use el editor para negrita, cursiva, listas y enlaces.',
            },
          },
          label: {
            en: 'User Email Message',
            uk: 'Текст листа користувачу',
            es: 'Mensaje del email al usuario',
          },
        },
      ],
    },
  ],
}
