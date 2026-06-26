import type { CSSProperties } from 'react'

type DesignSettingsRecord = Record<string, unknown>

function getGroup(value: unknown): DesignSettingsRecord | null {
  return value && typeof value === 'object' ? (value as DesignSettingsRecord) : null
}

function getString(
  group: DesignSettingsRecord | null | undefined,
  key: string,
  fallback: string,
): string {
  const value = group?.[key]
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

export const defaultDesignSettings = {
  colors: {
    mainBackground: '#fafafa',
    mainText: '#22282b',
    mutedText: '#909da2',
    accent: '#3c5557',
    accentHover: '#34494a',
    placeholderBackground: '#e8e0d8',
    placeholderText: '#909da2',
  },
  typography: {
    h1DesktopSize: 'clamp(2rem, 3vw, 3rem)',
    h1DesktopLineHeight: '1.1',
    h1MobileSize: '1.5rem',
    h1MobileLineHeight: '1.35',
    h1Weight: '700',
    h2DesktopSize: 'clamp(1.75rem, 2.4vw, 2.5rem)',
    h2DesktopLineHeight: '1.15',
    h2MobileSize: '1.5rem',
    h2MobileLineHeight: '1.25',
    h2Weight: '700',
    h3DesktopSize: 'clamp(1.25rem, 1.8vw, 1.75rem)',
    h3DesktopLineHeight: '1.2',
    h3MobileSize: '1.2rem',
    h3MobileLineHeight: '1.3',
    h3Weight: '600',
    bodyDesktopSize: 'clamp(0.98rem, 1.1vw, 1.06rem)',
    bodyDesktopLineHeight: '1.7',
    bodyMobileSize: '0.95rem',
    bodyMobileLineHeight: '1.6',
    bodyWeight: '500',
  },
  buttons: {
    minHeightDesktop: '48px',
    paddingYDesktop: '0.75rem',
    paddingXDesktop: '1.75rem',
    fontSizeDesktop: '15px',
    minHeightMobile: '44px',
    paddingYMobile: '0.65rem',
    paddingXMobile: '1.25rem',
    fontSizeMobile: '14px',
    radius: '9999px',
    primaryBg: '#3c5557',
    primaryBorder: '#3c5557',
    primaryText: '#fafafa',
    primaryHoverBg: 'transparent',
    primaryHoverBorder: '#3c5557',
    primaryHoverText: '#3c5557',
    outlineBg: 'transparent',
    outlineBorder: '#3c5557',
    outlineText: '#3c5557',
    outlineHoverBg: '#3c5557',
    outlineHoverBorder: '#3c5557',
    outlineHoverText: '#fafafa',
    lightBg: '#fafafa',
    lightBorder: '#fafafa',
    lightText: '#3c5557',
    lightHoverBg: 'transparent',
    lightHoverBorder: '#fafafa',
    lightHoverText: '#fafafa',
    textText: '#3c5557',
    textHoverText: '#22282b',
    textFontSizeDesktop: '14px',
    textFontSizeMobile: '13px',
  },
  themes: {
    whiteSection: '#ffffff',
    whiteSectionAlt: '#ffffff',
    whitePanel: '#ffffff',
    whitePanelAlt: '#ffffff',
    whiteCard: '#ffffff',
    whiteCardAlt: '#ffffff',
    softSection: '#fafafa',
    softSectionAlt: '#ffffff',
    softPanel: '#fbf6f3',
    softPanelAlt: '#f4ede7',
    softCard: '#ffffff',
    softCardAlt: '#f4ede7',
    sandSection: '#f4ede7',
    sandSectionAlt: '#fbf6f3',
    sandPanel: '#fbf6f3',
    sandPanelAlt: '#ffffff',
    sandCard: '#ffffff',
    sandCardAlt: '#fbf6f3',
    sageSection: '#eef3f1',
    sageSectionAlt: '#f7faf8',
    sagePanel: '#f7faf8',
    sagePanelAlt: '#ffffff',
    sageCard: '#ffffff',
    sageCardAlt: '#f7faf8',
  },
} as const

export function getDesignSettingsVars(
  settings?: DesignSettingsRecord | null,
): CSSProperties & Record<string, string> {
  const colors = getGroup(settings?.colors)
  const typography = getGroup(settings?.typography)
  const buttons = getGroup(settings?.buttons)
  const themes = getGroup(settings?.themes)

  return {
    '--main-bg-color': getString(colors, 'mainBackground', defaultDesignSettings.colors.mainBackground),
    '--main-text-color': getString(colors, 'mainText', defaultDesignSettings.colors.mainText),
    '--second-text-color': getString(colors, 'mutedText', defaultDesignSettings.colors.mutedText),
    '--accent-color': getString(colors, 'accent', defaultDesignSettings.colors.accent),
    '--accent-hover-color': getString(colors, 'accentHover', defaultDesignSettings.colors.accentHover),
    '--main-button-bg-color': getString(buttons, 'primaryBg', defaultDesignSettings.buttons.primaryBg),
    '--main-button-hover-bg-color': getString(buttons, 'primaryHoverBg', defaultDesignSettings.buttons.primaryHoverBg),
    '--placeholder-bg-color': getString(
      colors,
      'placeholderBackground',
      defaultDesignSettings.colors.placeholderBackground,
    ),
    '--placeholder-text-color': getString(
      colors,
      'placeholderText',
      defaultDesignSettings.colors.placeholderText,
    ),

    '--font-size-h1-desktop': getString(typography, 'h1DesktopSize', defaultDesignSettings.typography.h1DesktopSize),
    '--line-height-h1-desktop': getString(
      typography,
      'h1DesktopLineHeight',
      defaultDesignSettings.typography.h1DesktopLineHeight,
    ),
    '--font-size-h1-mobile': getString(typography, 'h1MobileSize', defaultDesignSettings.typography.h1MobileSize),
    '--line-height-h1-mobile': getString(
      typography,
      'h1MobileLineHeight',
      defaultDesignSettings.typography.h1MobileLineHeight,
    ),
    '--font-weight-h1': getString(typography, 'h1Weight', defaultDesignSettings.typography.h1Weight),
    '--font-size-h2-desktop': getString(typography, 'h2DesktopSize', defaultDesignSettings.typography.h2DesktopSize),
    '--line-height-h2-desktop': getString(
      typography,
      'h2DesktopLineHeight',
      defaultDesignSettings.typography.h2DesktopLineHeight,
    ),
    '--font-size-h2-mobile': getString(typography, 'h2MobileSize', defaultDesignSettings.typography.h2MobileSize),
    '--line-height-h2-mobile': getString(
      typography,
      'h2MobileLineHeight',
      defaultDesignSettings.typography.h2MobileLineHeight,
    ),
    '--font-weight-h2': getString(typography, 'h2Weight', defaultDesignSettings.typography.h2Weight),
    '--font-size-h3-desktop': getString(typography, 'h3DesktopSize', defaultDesignSettings.typography.h3DesktopSize),
    '--line-height-h3-desktop': getString(
      typography,
      'h3DesktopLineHeight',
      defaultDesignSettings.typography.h3DesktopLineHeight,
    ),
    '--font-size-h3-mobile': getString(typography, 'h3MobileSize', defaultDesignSettings.typography.h3MobileSize),
    '--line-height-h3-mobile': getString(
      typography,
      'h3MobileLineHeight',
      defaultDesignSettings.typography.h3MobileLineHeight,
    ),
    '--font-weight-h3': getString(typography, 'h3Weight', defaultDesignSettings.typography.h3Weight),
    '--font-size-body-desktop': getString(
      typography,
      'bodyDesktopSize',
      defaultDesignSettings.typography.bodyDesktopSize,
    ),
    '--line-height-body-desktop': getString(
      typography,
      'bodyDesktopLineHeight',
      defaultDesignSettings.typography.bodyDesktopLineHeight,
    ),
    '--font-size-body-mobile': getString(typography, 'bodyMobileSize', defaultDesignSettings.typography.bodyMobileSize),
    '--line-height-body-mobile': getString(
      typography,
      'bodyMobileLineHeight',
      defaultDesignSettings.typography.bodyMobileLineHeight,
    ),
    '--font-weight-body': getString(typography, 'bodyWeight', defaultDesignSettings.typography.bodyWeight),

    '--button-min-height-desktop': getString(
      buttons,
      'minHeightDesktop',
      defaultDesignSettings.buttons.minHeightDesktop,
    ),
    '--button-padding-y-desktop': getString(
      buttons,
      'paddingYDesktop',
      defaultDesignSettings.buttons.paddingYDesktop,
    ),
    '--button-padding-x-desktop': getString(
      buttons,
      'paddingXDesktop',
      defaultDesignSettings.buttons.paddingXDesktop,
    ),
    '--button-font-size-desktop': getString(
      buttons,
      'fontSizeDesktop',
      defaultDesignSettings.buttons.fontSizeDesktop,
    ),
    '--button-min-height-mobile': getString(buttons, 'minHeightMobile', defaultDesignSettings.buttons.minHeightMobile),
    '--button-padding-y-mobile': getString(buttons, 'paddingYMobile', defaultDesignSettings.buttons.paddingYMobile),
    '--button-padding-x-mobile': getString(buttons, 'paddingXMobile', defaultDesignSettings.buttons.paddingXMobile),
    '--button-font-size-mobile': getString(buttons, 'fontSizeMobile', defaultDesignSettings.buttons.fontSizeMobile),
    '--button-radius': getString(buttons, 'radius', defaultDesignSettings.buttons.radius),

    '--button-primary-bg': getString(buttons, 'primaryBg', defaultDesignSettings.buttons.primaryBg),
    '--button-primary-border': getString(buttons, 'primaryBorder', defaultDesignSettings.buttons.primaryBorder),
    '--button-primary-text': getString(buttons, 'primaryText', defaultDesignSettings.buttons.primaryText),
    '--button-primary-hover-bg': getString(
      buttons,
      'primaryHoverBg',
      defaultDesignSettings.buttons.primaryHoverBg,
    ),
    '--button-primary-hover-border': getString(
      buttons,
      'primaryHoverBorder',
      defaultDesignSettings.buttons.primaryHoverBorder,
    ),
    '--button-primary-hover-text': getString(
      buttons,
      'primaryHoverText',
      defaultDesignSettings.buttons.primaryHoverText,
    ),

    '--button-outline-bg': getString(buttons, 'outlineBg', defaultDesignSettings.buttons.outlineBg),
    '--button-outline-border': getString(buttons, 'outlineBorder', defaultDesignSettings.buttons.outlineBorder),
    '--button-outline-text': getString(buttons, 'outlineText', defaultDesignSettings.buttons.outlineText),
    '--button-outline-hover-bg': getString(
      buttons,
      'outlineHoverBg',
      defaultDesignSettings.buttons.outlineHoverBg,
    ),
    '--button-outline-hover-border': getString(
      buttons,
      'outlineHoverBorder',
      defaultDesignSettings.buttons.outlineHoverBorder,
    ),
    '--button-outline-hover-text': getString(
      buttons,
      'outlineHoverText',
      defaultDesignSettings.buttons.outlineHoverText,
    ),

    '--button-light-bg': getString(buttons, 'lightBg', defaultDesignSettings.buttons.lightBg),
    '--button-light-border': getString(buttons, 'lightBorder', defaultDesignSettings.buttons.lightBorder),
    '--button-light-text': getString(buttons, 'lightText', defaultDesignSettings.buttons.lightText),
    '--button-light-hover-bg': getString(buttons, 'lightHoverBg', defaultDesignSettings.buttons.lightHoverBg),
    '--button-light-hover-border': getString(
      buttons,
      'lightHoverBorder',
      defaultDesignSettings.buttons.lightHoverBorder,
    ),
    '--button-light-hover-text': getString(
      buttons,
      'lightHoverText',
      defaultDesignSettings.buttons.lightHoverText,
    ),

    '--button-text-color': getString(buttons, 'textText', defaultDesignSettings.buttons.textText),
    '--button-text-hover-color': getString(
      buttons,
      'textHoverText',
      defaultDesignSettings.buttons.textHoverText,
    ),
    '--button-text-font-size-desktop': getString(
      buttons,
      'textFontSizeDesktop',
      defaultDesignSettings.buttons.textFontSizeDesktop,
    ),
    '--button-text-font-size-mobile': getString(
      buttons,
      'textFontSizeMobile',
      defaultDesignSettings.buttons.textFontSizeMobile,
    ),

    '--theme-white-section': getString(themes, 'whiteSection', defaultDesignSettings.themes.whiteSection),
    '--theme-white-section-alt': getString(themes, 'whiteSectionAlt', defaultDesignSettings.themes.whiteSectionAlt),
    '--theme-white-panel': getString(themes, 'whitePanel', defaultDesignSettings.themes.whitePanel),
    '--theme-white-panel-alt': getString(themes, 'whitePanelAlt', defaultDesignSettings.themes.whitePanelAlt),
    '--theme-white-card': getString(themes, 'whiteCard', defaultDesignSettings.themes.whiteCard),
    '--theme-white-card-alt': getString(themes, 'whiteCardAlt', defaultDesignSettings.themes.whiteCardAlt),
    '--theme-soft-section': getString(themes, 'softSection', defaultDesignSettings.themes.softSection),
    '--theme-soft-section-alt': getString(themes, 'softSectionAlt', defaultDesignSettings.themes.softSectionAlt),
    '--theme-soft-panel': getString(themes, 'softPanel', defaultDesignSettings.themes.softPanel),
    '--theme-soft-panel-alt': getString(themes, 'softPanelAlt', defaultDesignSettings.themes.softPanelAlt),
    '--theme-soft-card': getString(themes, 'softCard', defaultDesignSettings.themes.softCard),
    '--theme-soft-card-alt': getString(themes, 'softCardAlt', defaultDesignSettings.themes.softCardAlt),
    '--theme-sand-section': getString(themes, 'sandSection', defaultDesignSettings.themes.sandSection),
    '--theme-sand-section-alt': getString(themes, 'sandSectionAlt', defaultDesignSettings.themes.sandSectionAlt),
    '--theme-sand-panel': getString(themes, 'sandPanel', defaultDesignSettings.themes.sandPanel),
    '--theme-sand-panel-alt': getString(themes, 'sandPanelAlt', defaultDesignSettings.themes.sandPanelAlt),
    '--theme-sand-card': getString(themes, 'sandCard', defaultDesignSettings.themes.sandCard),
    '--theme-sand-card-alt': getString(themes, 'sandCardAlt', defaultDesignSettings.themes.sandCardAlt),
    '--theme-sage-section': getString(themes, 'sageSection', defaultDesignSettings.themes.sageSection),
    '--theme-sage-section-alt': getString(themes, 'sageSectionAlt', defaultDesignSettings.themes.sageSectionAlt),
    '--theme-sage-panel': getString(themes, 'sagePanel', defaultDesignSettings.themes.sagePanel),
    '--theme-sage-panel-alt': getString(themes, 'sagePanelAlt', defaultDesignSettings.themes.sagePanelAlt),
    '--theme-sage-card': getString(themes, 'sageCard', defaultDesignSettings.themes.sageCard),
    '--theme-sage-card-alt': getString(themes, 'sageCardAlt', defaultDesignSettings.themes.sageCardAlt),
  }
}
