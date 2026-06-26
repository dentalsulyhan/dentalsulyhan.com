import type { Field, GlobalConfig } from 'payload'
import { defaultDesignSettings } from '@/lib/designSettings'

function textField(name: string, label: { en: string; uk: string; es: string }, defaultValue: string): Field {
  return {
    name,
    type: 'text',
    defaultValue,
    label,
  }
}

function colorField(name: string, label: { en: string; uk: string; es: string }, defaultValue: string): Field {
  return {
    name,
    type: 'text',
    defaultValue,
    label,
    admin: {
      description: {
        en: 'Use HEX, rgb(), rgba(), or any valid CSS color value.',
        uk: 'Використовуйте HEX, rgb(), rgba() або будь-яке валідне CSS-значення кольору.',
        es: 'Use HEX, rgb(), rgba() o cualquier valor de color CSS válido.',
      },
    },
  }
}

function collapsibleField(
  label: { en: string; uk: string; es: string },
  fields: Field[],
  initCollapsed = true,
): Field {
  return {
    type: 'collapsible',
    label,
    admin: {
      initCollapsed,
    },
    fields,
  }
}

export const DesignSettings: GlobalConfig = {
  slug: 'design-settings',
  label: {
    en: 'Design Settings',
    uk: 'Дизайн-налаштування',
    es: 'Configuracion de diseno',
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
        en: 'Brand Colors',
        uk: 'Брендові кольори',
        es: 'Colores de marca',
      },
      [
        {
          name: 'colors',
          type: 'group',
          label: {
            en: 'Brand Colors',
            uk: 'Брендові кольори',
            es: 'Colores de marca',
          },
          fields: [
            colorField('mainBackground', { en: 'Main Background', uk: 'Основний фон', es: 'Fondo principal' }, defaultDesignSettings.colors.mainBackground),
            colorField('mainText', { en: 'Main Text', uk: 'Основний текст', es: 'Texto principal' }, defaultDesignSettings.colors.mainText),
            colorField('mutedText', { en: 'Muted Text', uk: 'Другорядний текст', es: 'Texto secundario' }, defaultDesignSettings.colors.mutedText),
            colorField('accent', { en: 'Accent Color', uk: 'Акцентний колір', es: 'Color de acento' }, defaultDesignSettings.colors.accent),
            colorField('accentHover', { en: 'Accent Hover Color', uk: 'Акцентний колір hover', es: 'Color de acento hover' }, defaultDesignSettings.colors.accentHover),
            colorField('placeholderBackground', { en: 'Placeholder Background', uk: 'Фон заглушок', es: 'Fondo de placeholders' }, defaultDesignSettings.colors.placeholderBackground),
            colorField('placeholderText', { en: 'Placeholder Text', uk: 'Текст заглушок', es: 'Texto de placeholders' }, defaultDesignSettings.colors.placeholderText),
          ],
        },
      ],
      false,
    ),
    collapsibleField(
      {
        en: 'Typography',
        uk: 'Типографіка',
        es: 'Tipografia',
      },
      [
        {
          name: 'typography',
          type: 'group',
          label: {
            en: 'Typography',
            uk: 'Типографіка',
            es: 'Tipografia',
          },
          fields: [
            collapsibleField(
              { en: 'H1 Settings', uk: 'Налаштування H1', es: 'Ajustes de H1' },
              [
                textField('h1DesktopSize', { en: 'H1 Desktop Size', uk: 'H1 розмір desktop', es: 'H1 tamaño desktop' }, defaultDesignSettings.typography.h1DesktopSize),
                textField('h1DesktopLineHeight', { en: 'H1 Desktop Line Height', uk: 'H1 line-height desktop', es: 'H1 line-height desktop' }, defaultDesignSettings.typography.h1DesktopLineHeight),
                textField('h1MobileSize', { en: 'H1 Mobile Size', uk: 'H1 розмір mobile', es: 'H1 tamaño mobile' }, defaultDesignSettings.typography.h1MobileSize),
                textField('h1MobileLineHeight', { en: 'H1 Mobile Line Height', uk: 'H1 line-height mobile', es: 'H1 line-height mobile' }, defaultDesignSettings.typography.h1MobileLineHeight),
                textField('h1Weight', { en: 'H1 Weight', uk: 'H1 товщина', es: 'H1 peso' }, defaultDesignSettings.typography.h1Weight),
              ],
            ),
            collapsibleField(
              { en: 'H2 Settings', uk: 'Налаштування H2', es: 'Ajustes de H2' },
              [
                textField('h2DesktopSize', { en: 'H2 Desktop Size', uk: 'H2 розмір desktop', es: 'H2 tamaño desktop' }, defaultDesignSettings.typography.h2DesktopSize),
                textField('h2DesktopLineHeight', { en: 'H2 Desktop Line Height', uk: 'H2 line-height desktop', es: 'H2 line-height desktop' }, defaultDesignSettings.typography.h2DesktopLineHeight),
                textField('h2MobileSize', { en: 'H2 Mobile Size', uk: 'H2 розмір mobile', es: 'H2 tamaño mobile' }, defaultDesignSettings.typography.h2MobileSize),
                textField('h2MobileLineHeight', { en: 'H2 Mobile Line Height', uk: 'H2 line-height mobile', es: 'H2 line-height mobile' }, defaultDesignSettings.typography.h2MobileLineHeight),
                textField('h2Weight', { en: 'H2 Weight', uk: 'H2 товщина', es: 'H2 peso' }, defaultDesignSettings.typography.h2Weight),
              ],
            ),
            collapsibleField(
              { en: 'H3 Settings', uk: 'Налаштування H3', es: 'Ajustes de H3' },
              [
                textField('h3DesktopSize', { en: 'H3 Desktop Size', uk: 'H3 розмір desktop', es: 'H3 tamaño desktop' }, defaultDesignSettings.typography.h3DesktopSize),
                textField('h3DesktopLineHeight', { en: 'H3 Desktop Line Height', uk: 'H3 line-height desktop', es: 'H3 line-height desktop' }, defaultDesignSettings.typography.h3DesktopLineHeight),
                textField('h3MobileSize', { en: 'H3 Mobile Size', uk: 'H3 розмір mobile', es: 'H3 tamaño mobile' }, defaultDesignSettings.typography.h3MobileSize),
                textField('h3MobileLineHeight', { en: 'H3 Mobile Line Height', uk: 'H3 line-height mobile', es: 'H3 line-height mobile' }, defaultDesignSettings.typography.h3MobileLineHeight),
                textField('h3Weight', { en: 'H3 Weight', uk: 'H3 товщина', es: 'H3 peso' }, defaultDesignSettings.typography.h3Weight),
              ],
            ),
            collapsibleField(
              { en: 'Body Text Settings', uk: 'Налаштування основного тексту', es: 'Ajustes del texto principal' },
              [
                textField('bodyDesktopSize', { en: 'Body Desktop Size', uk: 'Текст розмір desktop', es: 'Texto tamaño desktop' }, defaultDesignSettings.typography.bodyDesktopSize),
                textField('bodyDesktopLineHeight', { en: 'Body Desktop Line Height', uk: 'Текст line-height desktop', es: 'Texto line-height desktop' }, defaultDesignSettings.typography.bodyDesktopLineHeight),
                textField('bodyMobileSize', { en: 'Body Mobile Size', uk: 'Текст розмір mobile', es: 'Texto tamaño mobile' }, defaultDesignSettings.typography.bodyMobileSize),
                textField('bodyMobileLineHeight', { en: 'Body Mobile Line Height', uk: 'Текст line-height mobile', es: 'Texto line-height mobile' }, defaultDesignSettings.typography.bodyMobileLineHeight),
                textField('bodyWeight', { en: 'Body Weight', uk: 'Текст товщина', es: 'Texto peso' }, defaultDesignSettings.typography.bodyWeight),
              ],
            ),
          ],
        },
      ],
    ),
    collapsibleField(
      {
        en: 'Buttons',
        uk: 'Кнопки',
        es: 'Botones',
      },
      [
        {
          name: 'buttons',
          type: 'group',
          label: {
            en: 'Buttons',
            uk: 'Кнопки',
            es: 'Botones',
          },
          fields: [
            collapsibleField(
              { en: 'Button Size & Shape', uk: 'Розмір і форма кнопок', es: 'Tamaño y forma de botones' },
              [
        textField('minHeightDesktop', { en: 'Desktop Min Height', uk: 'Desktop мін. висота', es: 'Desktop altura mínima' }, defaultDesignSettings.buttons.minHeightDesktop),
        textField('paddingYDesktop', { en: 'Desktop Vertical Padding', uk: 'Desktop вертикальний padding', es: 'Desktop padding vertical' }, defaultDesignSettings.buttons.paddingYDesktop),
        textField('paddingXDesktop', { en: 'Desktop Horizontal Padding', uk: 'Desktop горизонтальний padding', es: 'Desktop padding horizontal' }, defaultDesignSettings.buttons.paddingXDesktop),
        textField('fontSizeDesktop', { en: 'Desktop Font Size', uk: 'Desktop розмір шрифту', es: 'Desktop tamaño de fuente' }, defaultDesignSettings.buttons.fontSizeDesktop),
        textField('minHeightMobile', { en: 'Mobile Min Height', uk: 'Mobile мін. висота', es: 'Mobile altura mínima' }, defaultDesignSettings.buttons.minHeightMobile),
        textField('paddingYMobile', { en: 'Mobile Vertical Padding', uk: 'Mobile вертикальний padding', es: 'Mobile padding vertical' }, defaultDesignSettings.buttons.paddingYMobile),
        textField('paddingXMobile', { en: 'Mobile Horizontal Padding', uk: 'Mobile горизонтальний padding', es: 'Mobile padding horizontal' }, defaultDesignSettings.buttons.paddingXMobile),
        textField('fontSizeMobile', { en: 'Mobile Font Size', uk: 'Mobile розмір шрифту', es: 'Mobile tamaño de fuente' }, defaultDesignSettings.buttons.fontSizeMobile),
        textField('radius', { en: 'Border Radius', uk: 'Скруглення', es: 'Radio de borde' }, defaultDesignSettings.buttons.radius),
              ],
            ),
            collapsibleField(
              { en: 'Primary Button', uk: 'Основна кнопка', es: 'Botón principal' },
              [
        colorField('primaryBg', { en: 'Primary Background', uk: 'Primary фон', es: 'Primary fondo' }, defaultDesignSettings.buttons.primaryBg),
        colorField('primaryBorder', { en: 'Primary Border', uk: 'Primary рамка', es: 'Primary borde' }, defaultDesignSettings.buttons.primaryBorder),
        colorField('primaryText', { en: 'Primary Text', uk: 'Primary текст', es: 'Primary texto' }, defaultDesignSettings.buttons.primaryText),
        colorField('primaryHoverBg', { en: 'Primary Hover Background', uk: 'Primary hover фон', es: 'Primary hover fondo' }, defaultDesignSettings.buttons.primaryHoverBg),
        colorField('primaryHoverBorder', { en: 'Primary Hover Border', uk: 'Primary hover рамка', es: 'Primary hover borde' }, defaultDesignSettings.buttons.primaryHoverBorder),
        colorField('primaryHoverText', { en: 'Primary Hover Text', uk: 'Primary hover текст', es: 'Primary hover texto' }, defaultDesignSettings.buttons.primaryHoverText),
              ],
            ),
            collapsibleField(
              { en: 'Outline Button', uk: 'Контурна кнопка', es: 'Botón contorno' },
              [
        colorField('outlineBg', { en: 'Outline Background', uk: 'Outline фон', es: 'Outline fondo' }, defaultDesignSettings.buttons.outlineBg),
        colorField('outlineBorder', { en: 'Outline Border', uk: 'Outline рамка', es: 'Outline borde' }, defaultDesignSettings.buttons.outlineBorder),
        colorField('outlineText', { en: 'Outline Text', uk: 'Outline текст', es: 'Outline texto' }, defaultDesignSettings.buttons.outlineText),
        colorField('outlineHoverBg', { en: 'Outline Hover Background', uk: 'Outline hover фон', es: 'Outline hover fondo' }, defaultDesignSettings.buttons.outlineHoverBg),
        colorField('outlineHoverBorder', { en: 'Outline Hover Border', uk: 'Outline hover рамка', es: 'Outline hover borde' }, defaultDesignSettings.buttons.outlineHoverBorder),
        colorField('outlineHoverText', { en: 'Outline Hover Text', uk: 'Outline hover текст', es: 'Outline hover texto' }, defaultDesignSettings.buttons.outlineHoverText),
              ],
            ),
            collapsibleField(
              { en: 'Light Button', uk: 'Світла кнопка', es: 'Botón claro' },
              [
        colorField('lightBg', { en: 'Light Background', uk: 'Light фон', es: 'Light fondo' }, defaultDesignSettings.buttons.lightBg),
        colorField('lightBorder', { en: 'Light Border', uk: 'Light рамка', es: 'Light borde' }, defaultDesignSettings.buttons.lightBorder),
        colorField('lightText', { en: 'Light Text', uk: 'Light текст', es: 'Light texto' }, defaultDesignSettings.buttons.lightText),
        colorField('lightHoverBg', { en: 'Light Hover Background', uk: 'Light hover фон', es: 'Light hover fondo' }, defaultDesignSettings.buttons.lightHoverBg),
        colorField('lightHoverBorder', { en: 'Light Hover Border', uk: 'Light hover рамка', es: 'Light hover borde' }, defaultDesignSettings.buttons.lightHoverBorder),
        colorField('lightHoverText', { en: 'Light Hover Text', uk: 'Light hover текст', es: 'Light hover texto' }, defaultDesignSettings.buttons.lightHoverText),
              ],
            ),
            collapsibleField(
              { en: 'Text Button', uk: 'Текстова кнопка', es: 'Botón de texto' },
              [
        colorField('textText', { en: 'Text Button Color', uk: 'Text кнопка колір', es: 'Text botón color' }, defaultDesignSettings.buttons.textText),
        colorField('textHoverText', { en: 'Text Button Hover Color', uk: 'Text кнопка hover колір', es: 'Text botón hover color' }, defaultDesignSettings.buttons.textHoverText),
        textField('textFontSizeDesktop', { en: 'Text Button Desktop Size', uk: 'Text кнопка розмір desktop', es: 'Text botón tamaño desktop' }, defaultDesignSettings.buttons.textFontSizeDesktop),
        textField('textFontSizeMobile', { en: 'Text Button Mobile Size', uk: 'Text кнопка розмір mobile', es: 'Text botón tamaño mobile' }, defaultDesignSettings.buttons.textFontSizeMobile),
              ],
            ),
          ],
        },
      ],
    ),
    collapsibleField(
      {
        en: 'Background Presets',
        uk: 'Пресети фону',
        es: 'Presets de fondo',
      },
      [
        {
          name: 'themes',
          type: 'group',
          label: {
            en: 'Background Presets',
            uk: 'Пресети фону',
            es: 'Presets de fondo',
          },
          fields: [
            collapsibleField(
              { en: 'White Theme', uk: 'Біла тема', es: 'Tema blanco' },
              [
        colorField('whiteSection', { en: 'White Section', uk: 'White section', es: 'White section' }, defaultDesignSettings.themes.whiteSection),
        colorField('whiteSectionAlt', { en: 'White Section Alt', uk: 'White section alt', es: 'White section alt' }, defaultDesignSettings.themes.whiteSectionAlt),
        colorField('whitePanel', { en: 'White Panel', uk: 'White panel', es: 'White panel' }, defaultDesignSettings.themes.whitePanel),
        colorField('whitePanelAlt', { en: 'White Panel Alt', uk: 'White panel alt', es: 'White panel alt' }, defaultDesignSettings.themes.whitePanelAlt),
        colorField('whiteCard', { en: 'White Card', uk: 'White card', es: 'White card' }, defaultDesignSettings.themes.whiteCard),
        colorField('whiteCardAlt', { en: 'White Card Alt', uk: 'White card alt', es: 'White card alt' }, defaultDesignSettings.themes.whiteCardAlt),
              ],
            ),
            collapsibleField(
              { en: 'Soft Theme', uk: 'Світла тема', es: 'Tema suave' },
              [
        colorField('softSection', { en: 'Soft Section', uk: 'Soft section', es: 'Soft section' }, defaultDesignSettings.themes.softSection),
        colorField('softSectionAlt', { en: 'Soft Section Alt', uk: 'Soft section alt', es: 'Soft section alt' }, defaultDesignSettings.themes.softSectionAlt),
        colorField('softPanel', { en: 'Soft Panel', uk: 'Soft panel', es: 'Soft panel' }, defaultDesignSettings.themes.softPanel),
        colorField('softPanelAlt', { en: 'Soft Panel Alt', uk: 'Soft panel alt', es: 'Soft panel alt' }, defaultDesignSettings.themes.softPanelAlt),
        colorField('softCard', { en: 'Soft Card', uk: 'Soft card', es: 'Soft card' }, defaultDesignSettings.themes.softCard),
        colorField('softCardAlt', { en: 'Soft Card Alt', uk: 'Soft card alt', es: 'Soft card alt' }, defaultDesignSettings.themes.softCardAlt),
              ],
            ),
            collapsibleField(
              { en: 'Sand Theme', uk: 'Пісочна тема', es: 'Tema arena' },
              [
        colorField('sandSection', { en: 'Sand Section', uk: 'Sand section', es: 'Sand section' }, defaultDesignSettings.themes.sandSection),
        colorField('sandSectionAlt', { en: 'Sand Section Alt', uk: 'Sand section alt', es: 'Sand section alt' }, defaultDesignSettings.themes.sandSectionAlt),
        colorField('sandPanel', { en: 'Sand Panel', uk: 'Sand panel', es: 'Sand panel' }, defaultDesignSettings.themes.sandPanel),
        colorField('sandPanelAlt', { en: 'Sand Panel Alt', uk: 'Sand panel alt', es: 'Sand panel alt' }, defaultDesignSettings.themes.sandPanelAlt),
        colorField('sandCard', { en: 'Sand Card', uk: 'Sand card', es: 'Sand card' }, defaultDesignSettings.themes.sandCard),
        colorField('sandCardAlt', { en: 'Sand Card Alt', uk: 'Sand card alt', es: 'Sand card alt' }, defaultDesignSettings.themes.sandCardAlt),
              ],
            ),
            collapsibleField(
              { en: 'Sage Theme', uk: 'Шавлієва тема', es: 'Tema salvia' },
              [
        colorField('sageSection', { en: 'Sage Section', uk: 'Sage section', es: 'Sage section' }, defaultDesignSettings.themes.sageSection),
        colorField('sageSectionAlt', { en: 'Sage Section Alt', uk: 'Sage section alt', es: 'Sage section alt' }, defaultDesignSettings.themes.sageSectionAlt),
        colorField('sagePanel', { en: 'Sage Panel', uk: 'Sage panel', es: 'Sage panel' }, defaultDesignSettings.themes.sagePanel),
        colorField('sagePanelAlt', { en: 'Sage Panel Alt', uk: 'Sage panel alt', es: 'Sage panel alt' }, defaultDesignSettings.themes.sagePanelAlt),
        colorField('sageCard', { en: 'Sage Card', uk: 'Sage card', es: 'Sage card' }, defaultDesignSettings.themes.sageCard),
        colorField('sageCardAlt', { en: 'Sage Card Alt', uk: 'Sage card alt', es: 'Sage card alt' }, defaultDesignSettings.themes.sageCardAlt),
              ],
            ),
          ],
        },
      ],
    ),
  ],
}
