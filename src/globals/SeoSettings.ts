import type { GlobalConfig } from 'payload'
import { createGlobalRevalidationHook } from '@/lib/cacheRevalidation'

function collapsibleField(
  label: { en: string; uk: string; es: string },
  fields: any[],
  initCollapsed = true,
) {
  return {
    type: 'collapsible' as const,
    label,
    admin: {
      initCollapsed,
    },
    fields,
  }
}

export const SeoSettings: GlobalConfig = {
  slug: 'seo-settings',
  hooks: {
    afterChange: [
      createGlobalRevalidationHook([
        'public-seo-settings:es',
        'public-seo-settings:en',
        'public-seo-settings:uk',
        'configured-site-url',
      ], ['/', '/en', '/uk']),
    ],
  },
  label: {
    en: 'SEO Settings',
    uk: 'SEO Налаштування',
    es: 'Configuracion SEO',
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
  fields: [
    collapsibleField(
      {
        en: 'Site Defaults',
        uk: 'Дефолти сайту',
        es: 'Valores por defecto del sitio',
      },
      [
        {
          name: 'siteName',
          type: 'text',
          required: true,
          defaultValue: 'Dental Clinic Sulyhan',
          label: {
            en: 'Site Name',
            uk: 'Назва сайту',
            es: 'Nombre del sitio',
          },
        },
        {
          name: 'titleTemplate',
          type: 'text',
          required: true,
          defaultValue: '%s | Dental Clinic Sulyhan',
          label: {
            en: 'Title Template',
            uk: 'Шаблон заголовка',
            es: 'Plantilla del titulo',
          },
          admin: {
            description: {
              en: 'Use %s where the page title should be inserted.',
              uk: 'Використовуйте %s там, де має бути назва сторінки.',
              es: 'Use %s donde debe insertarse el titulo de la pagina.',
            },
          },
        },
        {
          name: 'baseUrl',
          type: 'text',
          label: {
            en: 'Base URL',
            uk: 'Базовий URL',
            es: 'URL base',
          },
          admin: {
            description: {
              en: 'Optional. Used for canonical URLs if you want to override the environment URL.',
              uk: 'Необов’язково. Використовується для canonical URL, якщо треба перевизначити URL з оточення.',
              es: 'Opcional. Se usa para URL canonicas si desea sobrescribir la URL del entorno.',
            },
          },
        },
      ],
      false,
    ),
    collapsibleField(
      {
        en: 'Default Metadata',
        uk: 'Дефолтні метадані',
        es: 'Metadatos por defecto',
      },
      [
        {
          name: 'defaultDescription',
          type: 'textarea',
          localized: true,
          label: {
            en: 'Default Meta Description',
            uk: 'Дефолтний Meta Description',
            es: 'Meta Description por defecto',
          },
        },
        {
          name: 'defaultOgImage',
          type: 'upload',
          relationTo: 'media',
          label: {
            en: 'Default Open Graph Image',
            uk: 'Дефолтне Open Graph зображення',
            es: 'Imagen Open Graph por defecto',
          },
        },
        {
          name: 'defaultTwitterCard',
          type: 'select',
          defaultValue: 'summary_large_image',
          options: [
            { label: 'Summary', value: 'summary' },
            { label: 'Summary Large Image', value: 'summary_large_image' },
          ],
          label: {
            en: 'Default Twitter Card',
            uk: 'Дефолтна Twitter Card',
            es: 'Twitter Card por defecto',
          },
        },
      ],
      false,
    ),
    collapsibleField(
      {
        en: 'Robots',
        uk: 'Robots',
        es: 'Robots',
      },
      [
        {
          name: 'indexSite',
          type: 'checkbox',
          defaultValue: true,
          label: {
            en: 'Allow Search Engines to Index the Site',
            uk: 'Дозволити пошуковим системам індексувати сайт',
            es: 'Permitir que los motores indexen el sitio',
          },
        },
        {
          name: 'followLinks',
          type: 'checkbox',
          defaultValue: true,
          label: {
            en: 'Allow Search Engines to Follow Links',
            uk: 'Дозволити пошуковим системам переходити за посиланнями',
            es: 'Permitir que los motores sigan enlaces',
          },
        },
      ],
      false,
    ),
    collapsibleField(
      {
        en: 'Organization Schema',
        uk: 'Схема організації',
        es: 'Schema de organizacion',
      },
      [
        {
          name: 'organizationName',
          type: 'text',
          defaultValue: 'Dental Clinic Sulyhan',
          label: {
            en: 'Organization Name',
            uk: 'Назва організації',
            es: 'Nombre de la organizacion',
          },
        },
        {
          name: 'organizationLogo',
          type: 'upload',
          relationTo: 'media',
          label: {
            en: 'Organization Logo',
            uk: 'Логотип організації',
            es: 'Logo de la organizacion',
          },
        },
        {
          name: 'organizationPhone',
          type: 'text',
          label: {
            en: 'Organization Phone',
            uk: 'Телефон організації',
            es: 'Telefono de la organizacion',
          },
        },
        {
          name: 'organizationEmail',
          type: 'text',
          label: {
            en: 'Organization Email',
            uk: 'Email організації',
            es: 'Email de la organizacion',
          },
        },
        {
          name: 'organizationAddress',
          type: 'text',
          localized: true,
          label: {
            en: 'Organization Address',
            uk: 'Адреса організації',
            es: 'Direccion de la organizacion',
          },
        },
      ],
      false,
    ),
  ],
}
