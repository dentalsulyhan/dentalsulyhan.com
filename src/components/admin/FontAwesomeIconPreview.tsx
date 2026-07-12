'use client'

import { useField, useLocale } from '@payloadcms/ui'
import type { FieldDescriptionClientProps } from 'payload'

import { FONT_AWESOME_ICON_OPTIONS, getFontAwesomeIconClass } from '@/lib/fontAwesomeIcons'

type LocaleCode = 'en' | 'es' | 'uk'

function getLocalizedLabel(
  label: string | Record<string, string>,
  locale: LocaleCode,
): string {
  if (typeof label === 'string') {
    return label
  }

  return label[locale] || label.en || Object.values(label)[0] || ''
}

export function FontAwesomeIconPreview({ path }: FieldDescriptionClientProps) {
  const locale = (useLocale()?.code || 'en') as LocaleCode
  const { value: selectedIcon, setValue } = useField<string>({ path })
  const iconSourcePath = path.replace(/fontAwesomeIcon$/, 'iconSource')
  const { value: iconSource } = useField<string>({ path: iconSourcePath })

  if (iconSource !== 'fontAwesome') {
    return null
  }

  return (
    <div
      style={{
        marginTop: '12px',
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: '12px',
        padding: '14px',
        background: 'var(--theme-elevation-50)',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          marginBottom: '10px',
          opacity: 0.8,
          textTransform: 'uppercase',
        }}
      >
        {locale === 'uk' ? 'Швидкий вибір' : locale === 'es' ? 'Seleccion rapida' : 'Quick preview'}
      </div>

      <div
        style={{
          display: 'grid',
          gap: '10px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(88px, 1fr))',
        }}
      >
        {FONT_AWESOME_ICON_OPTIONS.map((option) => {
          const isActive = selectedIcon === option.value
          const iconClass = getFontAwesomeIconClass(option.value)

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue(option.value)}
              style={{
                alignItems: 'center',
                background: isActive ? 'var(--theme-success-100)' : 'var(--theme-bg)',
                border: `1px solid ${isActive ? 'var(--theme-success-500)' : 'var(--theme-elevation-150)'}`,
                borderRadius: '10px',
                color: 'var(--theme-text)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                justifyContent: 'center',
                minHeight: '88px',
                padding: '12px 10px',
                transition: 'border-color 120ms ease, background 120ms ease',
              }}
            >
              {iconClass ? (
                <i
                  className={iconClass}
                  aria-hidden="true"
                  style={{
                    color: 'var(--theme-success-700)',
                    fontSize: '22px',
                    lineHeight: 1,
                  }}
                />
              ) : null}
              <span
                style={{
                  fontSize: '12px',
                  lineHeight: 1.25,
                  textAlign: 'center',
                }}
              >
                {getLocalizedLabel(option.label, locale)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default FontAwesomeIconPreview
