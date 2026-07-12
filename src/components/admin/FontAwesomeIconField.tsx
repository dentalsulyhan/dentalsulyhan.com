'use client'

import { useEffect, useMemo, useState } from 'react'
import { useField, useLocale } from '@payloadcms/ui'
import type { SelectFieldClientComponent } from 'payload'

import {
  FONT_AWESOME_ICON_OPTIONS,
  FONT_AWESOME_STYLE_OPTIONS,
  getSizedFontAwesomeIconMarkup,
  normalizeFontAwesomeIconValue,
} from '@/lib/fontAwesomeIcons'

type LocaleCode = 'en' | 'es' | 'uk'
type StyleFilter = 'all' | 'brands' | 'regular' | 'solid'

const INITIAL_VISIBLE_COUNT = 120

function getLocalizedLabel(
  label: string | Record<string, string>,
  locale: LocaleCode,
): string {
  if (typeof label === 'string') {
    return label
  }

  return label[locale] || label.en || Object.values(label)[0] || ''
}

function FontAwesomeSvgPreview({
  icon,
  isActive,
}: {
  icon: string
  isActive: boolean
}) {
  const markup = getSizedFontAwesomeIconMarkup(icon, 24)

  if (!markup) {
    return null
  }

  return (
    <span
      aria-hidden="true"
      style={{
        color: isActive ? 'var(--theme-success-700)' : 'var(--theme-text)',
        display: 'inline-flex',
      }}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  )
}

export const FontAwesomeIconField: SelectFieldClientComponent = ({ field, path }) => {
  const locale = (useLocale()?.code || 'en') as LocaleCode
  const { value, setValue, showError, errorMessage } = useField<string>({ path })
  const [search, setSearch] = useState('')
  const [styleFilter, setStyleFilter] = useState<StyleFilter>('all')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)

  const normalizedValue = normalizeFontAwesomeIconValue(value)

  useEffect(() => {
    if (value && normalizedValue && value !== normalizedValue) {
      setValue(normalizedValue)
    }
  }, [normalizedValue, setValue, value])

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }, [search, styleFilter])

  const filteredIcons = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return FONT_AWESOME_ICON_OPTIONS.filter((option) => {
      const matchesStyle = styleFilter === 'all' || option.style === styleFilter
      const matchesSearch =
        !normalizedSearch ||
        option.searchText.includes(normalizedSearch) ||
        option.value.includes(normalizedSearch)

      return matchesStyle && matchesSearch
    })
  }, [search, styleFilter])

  const visibleIcons = filteredIcons.slice(0, visibleCount)
  const selectedOption = FONT_AWESOME_ICON_OPTIONS.find((option) => option.value === normalizedValue)

  return (
    <div className="field-type text" style={{ marginBottom: '24px' }}>
      <div style={{ marginBottom: '10px' }}>
        <label
          htmlFor={`${path}-search`}
          style={{
            color: 'var(--theme-text)',
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '6px',
          }}
        >
          {getLocalizedLabel(field.label || 'Font Awesome Icon', locale)}
          {field.required ? <span style={{ color: 'var(--theme-error-500)', marginLeft: '4px' }}>*</span> : null}
        </label>

        {field.admin?.description ? (
          <div style={{ color: 'var(--theme-elevation-600)', fontSize: '12px', lineHeight: 1.5 }}>
            {getLocalizedLabel(field.admin.description, locale)}
          </div>
        ) : null}
      </div>

      <input id={path} type="hidden" value={normalizedValue || ''} readOnly />

      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '14px',
        }}
      >
        <input
          id={`${path}-search`}
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={
            locale === 'uk'
              ? 'Пошук іконки'
              : locale === 'es'
                ? 'Buscar icono'
                : 'Search icon'
          }
          style={{
            background: 'var(--theme-input-bg)',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '10px',
            color: 'var(--theme-text)',
            flex: '1 1 280px',
            fontSize: '14px',
            minHeight: '42px',
            padding: '0 14px',
          }}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setStyleFilter('all')}
            style={{
              background: styleFilter === 'all' ? 'var(--theme-success-100)' : 'var(--theme-input-bg)',
              border: `1px solid ${styleFilter === 'all' ? 'var(--theme-success-500)' : 'var(--theme-elevation-150)'}`,
              borderRadius: '999px',
              cursor: 'pointer',
              fontSize: '12px',
              minHeight: '36px',
              padding: '0 12px',
            }}
          >
            {locale === 'uk' ? 'Усі' : locale === 'es' ? 'Todos' : 'All'}
          </button>

          {FONT_AWESOME_STYLE_OPTIONS.map((option) => {
            const isActive = styleFilter === option.value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setStyleFilter(option.value)}
                style={{
                  background: isActive ? 'var(--theme-success-100)' : 'var(--theme-input-bg)',
                  border: `1px solid ${isActive ? 'var(--theme-success-500)' : 'var(--theme-elevation-150)'}`,
                  borderRadius: '999px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  minHeight: '36px',
                  padding: '0 12px',
                }}
              >
                {getLocalizedLabel(option.label, locale)}
              </button>
            )
          })}
        </div>
      </div>

      <div
        style={{
          alignItems: 'center',
          color: 'var(--theme-elevation-700)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <div style={{ fontSize: '12px' }}>
          {locale === 'uk'
            ? `Знайдено: ${filteredIcons.length}`
            : locale === 'es'
              ? `Encontrados: ${filteredIcons.length}`
              : `Found: ${filteredIcons.length}`}
        </div>

        {selectedOption ? (
          <div style={{ alignItems: 'center', display: 'flex', gap: '8px', fontSize: '12px' }}>
            <FontAwesomeSvgPreview icon={selectedOption.value} isActive />
            <span>{selectedOption.title}</span>
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: 'grid',
          gap: '10px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
        }}
      >
        {visibleIcons.map((option) => {
          const isActive = normalizedValue === option.value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue(option.value)}
              aria-pressed={isActive}
              title={option.title}
              style={{
                alignItems: 'center',
                background: isActive ? 'var(--theme-success-100)' : 'var(--theme-input-bg)',
                border: `1px solid ${isActive ? 'var(--theme-success-500)' : 'var(--theme-elevation-150)'}`,
                borderRadius: '10px',
                color: 'var(--theme-text)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                justifyContent: 'center',
                minHeight: '104px',
                overflow: 'hidden',
                padding: '14px 12px',
              }}
            >
              <FontAwesomeSvgPreview icon={option.value} isActive={isActive} />

              <span
                style={{
                  fontSize: '12px',
                  lineHeight: 1.3,
                  maxWidth: '100%',
                  overflowWrap: 'anywhere',
                  textAlign: 'center',
                }}
              >
                {option.title}
              </span>
            </button>
          )
        })}
      </div>

      {visibleCount < filteredIcons.length ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '14px' }}>
          <button
            type="button"
            onClick={() => setVisibleCount((current) => current + INITIAL_VISIBLE_COUNT)}
            style={{
              background: 'var(--theme-input-bg)',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: '10px',
              cursor: 'pointer',
              minHeight: '40px',
              padding: '0 16px',
            }}
          >
            {locale === 'uk'
              ? 'Показати ще'
              : locale === 'es'
                ? 'Mostrar mas'
                : 'Show more'}
          </button>
        </div>
      ) : null}

      {showError && errorMessage ? (
        <div style={{ color: 'var(--theme-error-500)', fontSize: '12px', marginTop: '8px' }}>{errorMessage}</div>
      ) : null}
    </div>
  )
}

export default FontAwesomeIconField
