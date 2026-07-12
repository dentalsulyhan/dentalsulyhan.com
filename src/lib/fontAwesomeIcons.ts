import type { Field } from 'payload'

export const FONT_AWESOME_ICON_OPTIONS = [
  { value: 'tooth', label: { en: 'Tooth', uk: 'Зуб', es: 'Diente' } },
  { value: 'teeth-open', label: { en: 'Open Teeth', uk: 'Відкриті зуби', es: 'Dientes abiertos' } },
  { value: 'smile', label: { en: 'Smile', uk: 'Посмішка', es: 'Sonrisa' } },
  { value: 'star', label: { en: 'Star', uk: 'Зірка', es: 'Estrella' } },
  { value: 'heart', label: { en: 'Heart', uk: 'Серце', es: 'Corazon' } },
  { value: 'shield', label: { en: 'Shield', uk: 'Щит', es: 'Escudo' } },
  { value: 'circle-check', label: { en: 'Check Circle', uk: 'Коло з галочкою', es: 'Circulo con check' } },
  { value: 'check', label: { en: 'Check', uk: 'Галочка', es: 'Check' } },
  { value: 'award', label: { en: 'Award', uk: 'Нагорода', es: 'Premio' } },
  { value: 'medal', label: { en: 'Medal', uk: 'Медаль', es: 'Medalla' } },
  { value: 'clock', label: { en: 'Clock', uk: 'Годинник', es: 'Reloj' } },
  { value: 'calendar-check', label: { en: 'Calendar Check', uk: 'Календар', es: 'Calendario con check' } },
  { value: 'stethoscope', label: { en: 'Stethoscope', uk: 'Стетоскоп', es: 'Estetoscopio' } },
  { value: 'user-doctor', label: { en: 'Doctor', uk: 'Лікар', es: 'Doctor' } },
  { value: 'hand-holding-heart', label: { en: 'Care', uk: 'Турбота', es: 'Cuidado' } },
  { value: 'lightbulb', label: { en: 'Lightbulb', uk: 'Лампочка', es: 'Bombilla' } },
  { value: 'location-dot', label: { en: 'Location', uk: 'Локація', es: 'Ubicacion' } },
  { value: 'phone', label: { en: 'Phone', uk: 'Телефон', es: 'Telefono' } },
  { value: 'thumbs-up', label: { en: 'Thumbs Up', uk: 'Вподобайка', es: 'Pulgar arriba' } },
  { value: 'sparkles', label: { en: 'Sparkles', uk: 'Іскри', es: 'Destellos' } },
] as const

export function buildIconChoiceFields({
  localized,
}: {
  localized?: boolean
} = {}): Field[] {
  const sharedLocalized = localized === undefined ? {} : { localized }

  return [
    {
      name: 'iconSource',
      type: 'select',
      defaultValue: 'upload',
      options: [
        {
          value: 'upload',
          label: {
            en: 'Upload icon',
            uk: 'Завантажити іконку',
            es: 'Subir icono',
          },
        },
        {
          value: 'fontAwesome',
          label: {
            en: 'Font Awesome',
            uk: 'Font Awesome',
            es: 'Font Awesome',
          },
        },
      ],
      label: {
        en: 'Icon Source',
        uk: 'Джерело іконки',
        es: 'Fuente del icono',
      },
      ...sharedLocalized,
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      label: {
        en: 'Icon',
        uk: 'Іконка',
        es: 'Icono',
      },
      admin: {
        condition: (_, siblingData) => siblingData?.iconSource !== 'fontAwesome',
      },
      ...sharedLocalized,
    },
    {
      name: 'fontAwesomeIcon',
      type: 'select',
      options: FONT_AWESOME_ICON_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label,
      })),
      label: {
        en: 'Font Awesome Icon',
        uk: 'Іконка Font Awesome',
        es: 'Icono de Font Awesome',
      },
      admin: {
        condition: (_, siblingData) => siblingData?.iconSource === 'fontAwesome',
        description: {
          en: 'Choose one of the free built-in Font Awesome icons.',
          uk: 'Оберіть одну з безкоштовних вбудованих іконок Font Awesome.',
          es: 'Elige uno de los iconos gratuitos integrados de Font Awesome.',
        },
        components: {
          afterInput: ['/components/admin/FontAwesomeIconPreview#FontAwesomeIconPreview'],
        },
      },
      ...sharedLocalized,
    },
  ]
}

export function getFontAwesomeIconClass(icon: string | null | undefined) {
  const normalized = icon?.trim()
  return normalized ? `fa-solid fa-${normalized}` : null
}
