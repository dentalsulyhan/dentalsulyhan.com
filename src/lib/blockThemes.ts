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
  panelColor: string
  panelAltColor: string
  card: string
  cardAlt: string
  cardColor: string
  cardAltColor: string
}

type ThemeBackgroundTarget = 'section' | 'sectionAlt' | 'panel' | 'panelAlt' | 'card' | 'cardAlt'

const blockThemes: Record<BlockThemeKey, ThemePalette> = {
  white: {
    section: 'theme-section-white',
    sectionAlt: 'theme-section-white-alt',
    sectionColor: 'var(--theme-white-section)',
    sectionAltColor: 'var(--theme-white-section-alt)',
    panel: 'theme-panel-white',
    panelAlt: 'theme-panel-white-alt',
    panelColor: 'var(--theme-white-panel)',
    panelAltColor: 'var(--theme-white-panel-alt)',
    card: 'theme-card-white',
    cardAlt: 'theme-card-white-alt',
    cardColor: 'var(--theme-white-card)',
    cardAltColor: 'var(--theme-white-card-alt)',
  },
  soft: {
    section: 'theme-section-soft',
    sectionAlt: 'theme-section-soft-alt',
    sectionColor: 'var(--theme-soft-section)',
    sectionAltColor: 'var(--theme-soft-section-alt)',
    panel: 'theme-panel-soft',
    panelAlt: 'theme-panel-soft-alt',
    panelColor: 'var(--theme-soft-panel)',
    panelAltColor: 'var(--theme-soft-panel-alt)',
    card: 'theme-card-soft',
    cardAlt: 'theme-card-soft-alt',
    cardColor: 'var(--theme-soft-card)',
    cardAltColor: 'var(--theme-soft-card-alt)',
  },
  sand: {
    section: 'theme-section-sand',
    sectionAlt: 'theme-section-sand-alt',
    sectionColor: 'var(--theme-sand-section)',
    sectionAltColor: 'var(--theme-sand-section-alt)',
    panel: 'theme-panel-sand',
    panelAlt: 'theme-panel-sand-alt',
    panelColor: 'var(--theme-sand-panel)',
    panelAltColor: 'var(--theme-sand-panel-alt)',
    card: 'theme-card-sand',
    cardAlt: 'theme-card-sand-alt',
    cardColor: 'var(--theme-sand-card)',
    cardAltColor: 'var(--theme-sand-card-alt)',
  },
  sage: {
    section: 'theme-section-sage',
    sectionAlt: 'theme-section-sage-alt',
    sectionColor: 'var(--theme-sage-section)',
    sectionAltColor: 'var(--theme-sage-section-alt)',
    panel: 'theme-panel-sage',
    panelAlt: 'theme-panel-sage-alt',
    panelColor: 'var(--theme-sage-panel)',
    panelAltColor: 'var(--theme-sage-panel-alt)',
    card: 'theme-card-sage',
    cardAlt: 'theme-card-sage-alt',
    cardColor: 'var(--theme-sage-card)',
    cardAltColor: 'var(--theme-sage-card-alt)',
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

export function getThemeBackgroundStyle(theme: ThemePalette, target: ThemeBackgroundTarget) {
  const colorMap: Record<ThemeBackgroundTarget, string> = {
    section: theme.sectionColor,
    sectionAlt: theme.sectionAltColor,
    panel: theme.panelColor,
    panelAlt: theme.panelAltColor,
    card: theme.cardColor,
    cardAlt: theme.cardAltColor,
  }

  return {
    backgroundColor: colorMap[target],
  }
}
