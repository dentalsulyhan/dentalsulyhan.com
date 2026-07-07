import type { Field } from 'payload'

function seoCollapsibleField(fields: Field[]): Field {
  return {
    type: 'collapsible',
    label: {
      en: 'SEO',
      uk: 'SEO',
      es: 'SEO',
    },
    admin: {
      initCollapsed: true,
    },
    fields,
  }
}

export function seoFields(): Field {
  return seoCollapsibleField([
    {
      name: 'metaTitle',
      type: 'text',
      localized: true,
      label: {
        en: 'Meta Title',
        uk: 'Meta Title',
        es: 'Meta Title',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      localized: true,
      label: {
        en: 'Meta Description',
        uk: 'Meta Description',
        es: 'Meta Description',
      },
    },
    {
      name: 'metaImage',
      type: 'upload',
      relationTo: 'media',
      label: {
        en: 'Share Image',
        uk: 'Зображення для поширення',
        es: 'Imagen para compartir',
      },
      admin: {
        description: {
          en: 'Used for Open Graph and Twitter cards.',
          uk: 'Використовується для Open Graph та Twitter карток.',
          es: 'Se usa para Open Graph y tarjetas de Twitter.',
        },
      },
    },
    {
      name: 'canonicalUrl',
      type: 'text',
      localized: true,
      label: {
        en: 'Canonical URL Override',
        uk: 'Перезапис canonical URL',
        es: 'Sobrescribir URL canonica',
      },
      admin: {
        description: {
          en: 'Optional. Leave empty to use the automatic localized URL.',
          uk: 'Необов’язково. Залиште порожнім для автоматичного локалізованого URL.',
          es: 'Opcional. Dejelo vacio para usar la URL localizada automatica.',
        },
      },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      defaultValue: false,
      label: {
        en: 'No Index',
        uk: 'Не індексувати',
        es: 'No indexar',
      },
    },
    {
      name: 'noFollow',
      type: 'checkbox',
      defaultValue: false,
      label: {
        en: 'No Follow',
        uk: 'Не передавати посилання',
        es: 'No seguir enlaces',
      },
    },
    {
      name: 'twitterCard',
      type: 'select',
      defaultValue: 'summary_large_image',
      options: [
        { label: 'Summary', value: 'summary' },
        { label: 'Summary Large Image', value: 'summary_large_image' },
      ],
      label: {
        en: 'Twitter Card Type',
        uk: 'Тип Twitter Card',
        es: 'Tipo de Twitter Card',
      },
    },
  ])
}
