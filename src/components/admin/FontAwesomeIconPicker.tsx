'use client'

import { useMemo, useState } from 'react'
import { useField, useLocale } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

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

function getSiblingPath(path: string, sibling: string) {
  const segments = path.split('.')
  segments[segments.length - 1] = sibling
  return segments.join('.')
}

function FontAwesomeSvgPreview({
  icon,
  isActive,
  size = 24,
}: {
  icon: string
  isActive: boolean
  size?: number
}) {
  const markup = getSizedFontAwesomeIconMarkup(icon, size)

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

export const FontAwesomeIconPicker: TextFieldClientComponent = ({ field, path }) => {
  const locale = (useLocale()?.code || 'en') as LocaleCode
  const iconPath = getSiblingPath(path, 'icon')
  const iconSourcePath = getSiblingPath(path, 'iconSource')

  const { value: uploadedIconValue, setValue: setUploadedIconValue } = useField<unknown>({ path: iconPath })
  const { value: iconSource, setValue: setIconSource } = useField<string>({ path: iconSourcePath })
  const { value: rawFontAwesomeIcon, setValue: setFontAwesomeIcon } = useField<string>({ path })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [styleFilter, setStyleFilter] = useState<StyleFilter>('all')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)

  const selectedIcon = normalizeFontAwesomeIconValue(rawFontAwesomeIcon)

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
  const selectedOption = FONT_AWESOME_ICON_OPTIONS.find((option) => option.value === selectedIcon)
  const isFontAwesomeActive = iconSource === 'fontAwesome' && Boolean(selectedIcon)
  const hasUploadedIcon = uploadedIconValue !== null && uploadedIconValue !== undefined && uploadedIconValue !== ''

  const openModal = () => {
    setSearch('')
    setStyleFilter('all')
    setVisibleCount(INITIAL_VISIBLE_COUNT)
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const handleChooseFontAwesome = (value: string) => {
    setFontAwesomeIcon(value)
    setIconSource('fontAwesome')
    setUploadedIconValue(null)
    closeModal()
  }

  const handleUseUpload = () => {
    setIconSource('upload')
    setFontAwesomeIcon(null)
  }

  const handleClearFontAwesome = () => {
    setFontAwesomeIcon(null)
    if (!hasUploadedIcon) {
      setIconSource('upload')
    }
  }

  return (
    <div style={{ marginBottom: '24px', marginTop: '8px' }}>
      <div style={{ marginBottom: '10px' }}>
        <label
          htmlFor={`${path}-open`}
          style={{
            color: 'var(--theme-text)',
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '6px',
          }}
        >
          {getLocalizedLabel(field.label || 'Font Awesome Icon', locale)}
        </label>
      </div>

      <input id={path} type="hidden" value={selectedIcon || ''} readOnly />

      <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <button
          id={`${path}-open`}
          type="button"
          onClick={openModal}
          style={{
            background: 'var(--theme-success-600)',
            border: '1px solid var(--theme-success-700)',
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            minHeight: '38px',
            padding: '0 14px',
          }}
        >
          {locale === 'uk'
            ? 'Обрати з Font Awesome'
            : locale === 'es'
              ? 'Elegir de Font Awesome'
              : 'Choose from Font Awesome'}
        </button>

        {isFontAwesomeActive ? (
          <button
            type="button"
            onClick={handleUseUpload}
            style={{
              background: 'var(--theme-input-bg)',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              minHeight: '38px',
              padding: '0 14px',
            }}
          >
            {locale === 'uk'
              ? 'Повернутись до upload'
              : locale === 'es'
                ? 'Volver a subida'
                : 'Use upload instead'}
          </button>
        ) : null}

        {selectedOption ? (
          <button
            type="button"
            onClick={handleClearFontAwesome}
            style={{
              background: 'transparent',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              minHeight: '38px',
              padding: '0 14px',
            }}
          >
            {locale === 'uk' ? 'Очистити вибір' : locale === 'es' ? 'Limpiar seleccion' : 'Clear selection'}
          </button>
        ) : null}
      </div>

      <div style={{ color: 'var(--theme-elevation-700)', fontSize: '12px', lineHeight: 1.5, marginTop: '10px' }}>
        {isFontAwesomeActive && selectedOption ? (
          <span style={{ alignItems: 'center', display: 'inline-flex', gap: '8px' }}>
            <FontAwesomeSvgPreview icon={selectedOption.value} isActive size={18} />
            <span>
              {locale === 'uk' ? 'Активна іконка:' : locale === 'es' ? 'Icono activo:' : 'Active icon:'}{' '}
              {selectedOption.title}
            </span>
          </span>
        ) : hasUploadedIcon ? (
          <span>
            {locale === 'uk'
              ? 'Зараз використовується завантажена іконка.'
              : locale === 'es'
                ? 'Ahora se usa el icono subido.'
                : 'The uploaded icon is currently active.'}
          </span>
        ) : (
          <span>
            {locale === 'uk'
              ? 'Можна або завантажити власну іконку, або обрати безкоштовну з Font Awesome.'
              : locale === 'es'
                ? 'Puedes subir tu propio icono o elegir uno gratuito de Font Awesome.'
                : 'You can upload your own icon or choose a free one from Font Awesome.'}
          </span>
        )}
      </div>

      {isModalOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            alignItems: 'center',
            background: 'rgba(14, 18, 20, 0.56)',
            display: 'flex',
            inset: 0,
            justifyContent: 'center',
            padding: '24px',
            position: 'fixed',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'var(--theme-bg)',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.18)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '88vh',
              maxWidth: '1100px',
              overflow: 'hidden',
              width: '100%',
            }}
          >
            <div
              style={{
                alignItems: 'center',
                borderBottom: '1px solid var(--theme-elevation-100)',
                display: 'flex',
                gap: '12px',
                justifyContent: 'space-between',
                padding: '18px 20px',
              }}
            >
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>
                  {locale === 'uk'
                    ? 'Іконки Font Awesome Free'
                    : locale === 'es'
                      ? 'Iconos Font Awesome Free'
                      : 'Font Awesome Free Icons'}
                </div>
                <div style={{ color: 'var(--theme-elevation-700)', fontSize: '12px', marginTop: '4px' }}>
                  {locale === 'uk'
                    ? `Доступно: ${FONT_AWESOME_ICON_OPTIONS.length}`
                    : locale === 'es'
                      ? `Disponibles: ${FONT_AWESOME_ICON_OPTIONS.length}`
                      : `Available: ${FONT_AWESOME_ICON_OPTIONS.length}`}
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--theme-elevation-150)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  minHeight: '38px',
                  minWidth: '38px',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ overflowY: 'auto', padding: '20px' }}>
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
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setVisibleCount(INITIAL_VISIBLE_COUNT)
                  }}
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
                    onClick={() => {
                      setStyleFilter('all')
                      setVisibleCount(INITIAL_VISIBLE_COUNT)
                    }}
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
                        onClick={() => {
                          setStyleFilter(option.value)
                          setVisibleCount(INITIAL_VISIBLE_COUNT)
                        }}
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

              <div style={{ color: 'var(--theme-elevation-700)', fontSize: '12px', marginBottom: '12px' }}>
                {locale === 'uk'
                  ? `Знайдено: ${filteredIcons.length}`
                  : locale === 'es'
                    ? `Encontrados: ${filteredIcons.length}`
                    : `Found: ${filteredIcons.length}`}
              </div>

              <div
                style={{
                  display: 'grid',
                  gap: '10px',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                }}
              >
                {visibleIcons.map((option) => {
                  const isActive = selectedIcon === option.value

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleChooseFontAwesome(option.value)}
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
                    {locale === 'uk' ? 'Показати ще' : locale === 'es' ? 'Mostrar mas' : 'Show more'}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default FontAwesomeIconPicker
