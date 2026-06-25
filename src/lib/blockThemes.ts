import type { SelectField } from 'payload'

export const blockThemeOptions = [
  {
    label: {
      en: 'White',
      uk: 'Білий',
      es: 'Blanco',
    },
    value: 'white',
  },
  {
    label: {
      en: 'Soft',
      uk: 'Світлий',
      es: 'Suave',
    },
    value: 'soft',
  },
  {
    label: {
      en: 'Sand',
      uk: 'Пісочний',
      es: 'Arena',
    },
    value: 'sand',
  },
  {
    label: {
      en: 'Sage',
      uk: 'Шавлія',
      es: 'Salvia',
    },
    value: 'sage',
  },
] as const

export const blockThemeField: SelectField = {
  name: 'theme',
  type: 'select',
  defaultValue: 'white',
  options: [...blockThemeOptions],
  label: {
    en: 'Background Theme',
    uk: 'Тема фону',
    es: 'Tema de fondo',
  },
  admin: {
    description: {
      en: 'Choose one of the base background color presets for this block.',
      uk: 'Оберіть один з базових пресетів кольору фону для цього блоку.',
      es: 'Elija uno de los colores base de fondo para este bloque.',
    },
  },
}

export const buttonStyleOptions = [
  {
    label: {
      en: 'Primary',
      uk: 'Основна',
      es: 'Principal',
    },
    value: 'primary',
  },
  {
    label: {
      en: 'Outline',
      uk: 'Контурна',
      es: 'Contorno',
    },
    value: 'outline',
  },
  {
    label: {
      en: 'Light',
      uk: 'Світла',
      es: 'Clara',
    },
    value: 'light',
  },
  {
    label: {
      en: 'Text Link',
      uk: 'Текстова',
      es: 'Texto',
    },
    value: 'text',
  },
] as const

export const buttonStyleField: SelectField = {
  name: 'buttonStyle',
  type: 'select',
  defaultValue: 'primary',
  options: [...buttonStyleOptions],
  label: {
    en: 'Button Style',
    uk: 'Стиль кнопки',
    es: 'Estilo del boton',
  },
  admin: {
    description: {
      en: 'Choose the visual style for the block button.',
      uk: 'Оберіть візуальний стиль кнопки для блоку.',
      es: 'Elija el estilo visual del boton del bloque.',
    },
  },
}

type BlockThemeKey = (typeof blockThemeOptions)[number]['value']
type ButtonStyleKey = (typeof buttonStyleOptions)[number]['value']

type ThemePalette = {
  section: string
  sectionAlt: string
  sectionColor: string
  sectionAltColor: string
  panel: string
  panelAlt: string
  card: string
  cardAlt: string
}

const blockThemes: Record<BlockThemeKey, ThemePalette> = {
  white: {
    section: 'bg-white',
    sectionAlt: 'bg-white',
    sectionColor: '#ffffff',
    sectionAltColor: '#ffffff',
    panel: 'bg-white',
    panelAlt: 'bg-white',
    card: 'bg-white',
    cardAlt: 'bg-white',
  },
  soft: {
    section: 'bg-[#fafafa]',
    sectionAlt: 'bg-white',
    sectionColor: '#fafafa',
    sectionAltColor: '#ffffff',
    panel: 'bg-[#fbf6f3]',
    panelAlt: 'bg-[#f4ede7]',
    card: 'bg-white',
    cardAlt: 'bg-[#f4ede7]',
  },
  sand: {
    section: 'bg-[#f4ede7]',
    sectionAlt: 'bg-[#fbf6f3]',
    sectionColor: '#f4ede7',
    sectionAltColor: '#fbf6f3',
    panel: 'bg-[#fbf6f3]',
    panelAlt: 'bg-white',
    card: 'bg-white',
    cardAlt: 'bg-[#fbf6f3]',
  },
  sage: {
    section: 'bg-[#eef3f1]',
    sectionAlt: 'bg-[#f7faf8]',
    sectionColor: '#eef3f1',
    sectionAltColor: '#f7faf8',
    panel: 'bg-[#f7faf8]',
    panelAlt: 'bg-white',
    card: 'bg-white',
    cardAlt: 'bg-[#f7faf8]',
  },
}

const buttonStyles: Record<ButtonStyleKey, string> = {
  primary:
    'site-button site-button--primary',
  outline:
    'site-button site-button--outline',
  light:
    'site-button site-button--light',
  text:
    'site-button site-button--text',
}

export function getBlockTheme(theme?: string | null): ThemePalette {
  if (!theme || !(theme in blockThemes)) {
    return blockThemes.white
  }

  return blockThemes[theme as BlockThemeKey]
}

export function getButtonStyle(buttonStyle?: string | null): string {
  if (!buttonStyle || !(buttonStyle in buttonStyles)) {
    return buttonStyles.primary
  }

  return buttonStyles[buttonStyle as ButtonStyleKey]
}
