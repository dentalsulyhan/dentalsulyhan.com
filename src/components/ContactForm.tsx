'use client'

import Script from 'next/script'
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { pushAnalyticsEvent } from '@/lib/analytics'

type FormOption = {
  id?: string | null
  label: string
}

interface ContactFormProps {
  locale: string
  fullNamePlaceholder: string
  phonePlaceholder: string
  emailPlaceholder: string
  patientTypePlaceholder: string
  referralSourcePlaceholder: string
  commentPlaceholder: string
  submitButtonLabel: string
  successMessage: string
  errorMessage: string
  patientTypeOptions: FormOption[]
  referralSourceOptions: FormOption[]
}

type FormState = {
  fullName: string
  phone: string
  email: string
  patientType: string
  referralSource: string
  comment: string
}

const initialState: FormState = {
  fullName: '',
  phone: '',
  email: '',
  patientType: '',
  referralSource: '',
  comment: '',
}

type TurnstileRenderOptions = {
  sitekey: string
  theme?: 'auto' | 'light' | 'dark'
  language?: string
  callback?: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: () => void
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: TurnstileRenderOptions) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}

export default function ContactForm({
  locale,
  fullNamePlaceholder,
  phonePlaceholder,
  emailPlaceholder,
  patientTypePlaceholder,
  referralSourcePlaceholder,
  commentPlaceholder,
  submitButtonLabel,
  successMessage,
  errorMessage,
  patientTypeOptions,
  referralSourceOptions,
}: ContactFormProps) {
  const fieldIds = {
    fullName: 'contact-form-full-name',
    phone: 'contact-form-phone',
    email: 'contact-form-email',
    patientType: 'contact-form-patient-type',
    referralSource: 'contact-form-referral-source',
    comment: 'contact-form-comment',
    turnstile: 'contact-form-turnstile',
    feedback: 'contact-form-feedback',
  } as const
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const isTurnstileEnabled = Boolean(turnstileSiteKey)
  const [formState, setFormState] = useState<FormState>(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)

  const captchaMessage =
    locale === 'uk'
      ? 'Підтвердіть, що ви не робот.'
      : locale === 'en'
        ? 'Please confirm that you are not a robot.'
        : 'Confirme que no es un robot.'

  const turnstileLanguage = locale === 'uk' ? 'uk' : locale === 'en' ? 'en' : 'es'

  const renderTurnstile = () => {
    if (!isTurnstileEnabled || !turnstileSiteKey || !turnstileRef.current || !window.turnstile || widgetIdRef.current) {
      return
    }

    widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
      sitekey: turnstileSiteKey,
      theme: 'auto',
      language: turnstileLanguage,
      callback: (token) => setTurnstileToken(token),
      'expired-callback': () => setTurnstileToken(''),
      'error-callback': () => setTurnstileToken(''),
    })
  }

  useEffect(() => {
    renderTurnstile()

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
      widgetIdRef.current = null
    }
  }, [isTurnstileEnabled, turnstileSiteKey, turnstileLanguage])

  const handleChange =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormState((prev) => ({
        ...prev,
        [field]: event.target.value,
      }))
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitState('idle')
    setMessage('')

    try {
      if (isTurnstileEnabled && !turnstileToken) {
        pushAnalyticsEvent({
          event: 'contact_form_error',
          locale,
          reason: 'captcha_missing',
          form_name: 'contact_form',
        })
        throw new Error(captchaMessage)
      }

      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formState,
          locale,
          turnstileToken,
        }),
      })

      const result = (await response.json().catch(() => null)) as { error?: string } | null

      if (!response.ok) {
        pushAnalyticsEvent({
          event: 'contact_form_error',
          locale,
          reason: `server_${response.status}`,
          form_name: 'contact_form',
        })
        throw new Error(result?.error || errorMessage)
      }

      setFormState(initialState)
      setTurnstileToken('')
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current)
      }
      setSubmitState('success')
      setMessage(successMessage)
      pushAnalyticsEvent({
        event: 'contact_form_submit',
        locale,
        form_name: 'contact_form',
        patient_type: formState.patientType,
        referral_source: formState.referralSource,
      })
    } catch (error) {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current)
      }
      setTurnstileToken('')
      setSubmitState('error')
      setMessage(error instanceof Error ? error.message : errorMessage)
      pushAnalyticsEvent({
        event: 'contact_form_error',
        locale,
        form_name: 'contact_form',
        reason: error instanceof Error ? error.message : 'unknown',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {isTurnstileEnabled && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={renderTurnstile}
        />
      )}
      <form onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor={fieldIds.fullName} className="sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0">
          {fullNamePlaceholder}
        </label>
        <input
          id={fieldIds.fullName}
          type="text"
          placeholder={fullNamePlaceholder}
          value={formState.fullName}
          onChange={handleChange('fullName')}
          aria-describedby={submitState !== 'idle' && message ? fieldIds.feedback : undefined}
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor={fieldIds.phone} className="sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0">
          {phonePlaceholder}
        </label>
        <input
          id={fieldIds.phone}
          type="tel"
          placeholder={phonePlaceholder}
          value={formState.phone}
          onChange={handleChange('phone')}
          aria-describedby={submitState !== 'idle' && message ? fieldIds.feedback : undefined}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor={fieldIds.email} className="sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0">
          {emailPlaceholder}
        </label>
        <input
          id={fieldIds.email}
          type="email"
          placeholder={emailPlaceholder}
          value={formState.email}
          onChange={handleChange('email')}
          aria-describedby={submitState !== 'idle' && message ? fieldIds.feedback : undefined}
          required
        />
      </div>
      <div className="form-select-row">
        <div className="form-group">
          <label htmlFor={fieldIds.patientType} className="sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0">
            {patientTypePlaceholder}
          </label>
          <select
            id={fieldIds.patientType}
            value={formState.patientType}
            onChange={handleChange('patientType')}
            aria-label={patientTypePlaceholder}
            aria-describedby={submitState !== 'idle' && message ? fieldIds.feedback : undefined}
            required
          >
            <option value="" disabled>
              {patientTypePlaceholder}
            </option>
            {patientTypeOptions.map((option, index) => (
              <option key={option.id || `${option.label}-${index}`} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor={fieldIds.referralSource} className="sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0">
            {referralSourcePlaceholder}
          </label>
          <select
            id={fieldIds.referralSource}
            value={formState.referralSource}
            onChange={handleChange('referralSource')}
            aria-label={referralSourcePlaceholder}
            aria-describedby={submitState !== 'idle' && message ? fieldIds.feedback : undefined}
            required
          >
            <option value="" disabled>
              {referralSourcePlaceholder}
            </option>
            {referralSourceOptions.map((option, index) => (
              <option key={option.id || `${option.label}-${index}`} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor={fieldIds.comment} className="sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0">
          {commentPlaceholder}
        </label>
        <input
          id={fieldIds.comment}
          type="text"
          placeholder={commentPlaceholder}
          value={formState.comment}
          onChange={handleChange('comment')}
          aria-describedby={submitState !== 'idle' && message ? fieldIds.feedback : undefined}
        />
      </div>
      {isTurnstileEnabled && (
        <div className="form-group">
          <div role="group" aria-labelledby={`${fieldIds.turnstile}-label`}>
            <span
              id={`${fieldIds.turnstile}-label`}
              className="sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
            >
              {captchaMessage}
            </span>
            <div
              id={fieldIds.turnstile}
              ref={turnstileRef}
            />
          </div>
        </div>
      )}
      <div className="form-group">
        <button type="submit" aria-label={submitButtonLabel} disabled={isSubmitting}>
          {isSubmitting ? '...' : submitButtonLabel}
        </button>
      </div>
      {submitState !== 'idle' && message && (
        <div
          id={fieldIds.feedback}
          role="status"
          aria-live="polite"
          className={`form-feedback text-[14px] leading-relaxed ${
            submitState === 'success' ? 'is-success' : 'is-error'
          }`}
        >
          <span className="form-feedback-icon" aria-hidden="true">
            {submitState === 'success' ? '✓' : '!'}
          </span>
          <span>{message}</span>
        </div>
      )}
      </form>
    </>
  )
}
