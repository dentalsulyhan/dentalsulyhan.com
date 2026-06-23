'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'

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
  const [formState, setFormState] = useState<FormState>(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

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
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formState,
          locale,
        }),
      })

      const result = (await response.json().catch(() => null)) as { error?: string } | null

      if (!response.ok) {
        throw new Error(result?.error || errorMessage)
      }

      setFormState(initialState)
      setSubmitState('success')
      setMessage(successMessage)
    } catch (error) {
      setSubmitState('error')
      setMessage(error instanceof Error ? error.message : errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          type="text"
          placeholder={fullNamePlaceholder}
          value={formState.fullName}
          onChange={handleChange('fullName')}
          required
        />
      </div>
      <div className="form-row">
        <input
          type="tel"
          placeholder={phonePlaceholder}
          value={formState.phone}
          onChange={handleChange('phone')}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="email"
          placeholder={emailPlaceholder}
          value={formState.email}
          onChange={handleChange('email')}
          required
        />
      </div>
      <div className="form-select-row">
        <div className="form-group">
          <select value={formState.patientType} onChange={handleChange('patientType')} required>
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
          <select value={formState.referralSource} onChange={handleChange('referralSource')} required>
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
        <input
          type="text"
          placeholder={commentPlaceholder}
          value={formState.comment}
          onChange={handleChange('comment')}
        />
      </div>
      <div className="form-group">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '...' : submitButtonLabel}
        </button>
      </div>
      {submitState !== 'idle' && message && (
        <div
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
  )
}
