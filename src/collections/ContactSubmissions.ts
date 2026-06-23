import type { CollectionConfig } from 'payload'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: {
    singular: {
      en: 'Contact Submission',
      uk: 'Заявка з форми',
      es: 'Solicitud de contacto',
    },
    plural: {
      en: 'Contact Submissions',
      uk: 'Заявки з форми',
      es: 'Solicitudes de contacto',
    },
  },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'phone', 'email', 'locale', 'createdAt'],
    group: {
      en: 'Leads',
      uk: 'Заявки',
      es: 'Solicitudes',
    },
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
    create: () => false,
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: {
        en: 'Full Name',
        uk: 'ПІБ',
        es: 'Nombre completo',
      },
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: {
        en: 'Phone',
        uk: 'Телефон',
        es: 'Telefono',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: {
        en: 'Email',
        uk: 'Email',
        es: 'Email',
      },
    },
    {
      name: 'patientType',
      type: 'text',
      required: true,
      label: {
        en: 'Patient Type',
        uk: 'Тип пацієнта',
        es: 'Tipo de paciente',
      },
    },
    {
      name: 'referralSource',
      type: 'text',
      required: true,
      label: {
        en: 'Referral Source',
        uk: 'Звідки дізнався',
        es: 'Como nos conocio',
      },
    },
    {
      name: 'comment',
      type: 'textarea',
      label: {
        en: 'Comment',
        uk: 'Коментар',
        es: 'Comentario',
      },
    },
    {
      name: 'locale',
      type: 'select',
      required: true,
      options: [
        { label: 'Español', value: 'es' },
        { label: 'English', value: 'en' },
        { label: 'Українська', value: 'uk' },
      ],
      label: {
        en: 'Locale',
        uk: 'Мова',
        es: 'Idioma',
      },
    },
  ],
  timestamps: true,
}
