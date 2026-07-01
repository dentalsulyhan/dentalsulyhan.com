'use client'

import React from 'react'

export function FormPlaceholdersNote() {
  return (
    <div
      style={{
        padding: '14px 16px',
        borderRadius: '12px',
        background: '#f4ede7',
        border: '1px solid rgba(60, 85, 87, 0.15)',
        color: '#22282b',
        fontSize: '14px',
        lineHeight: 1.6,
      }}
    >
      Available placeholders: <code>{'{fullName}'}</code>, <code>{'{phone}'}</code>,{' '}
      <code>{'{email}'}</code>, <code>{'{patientType}'}</code>,{' '}
      <code>{'{referralSource}'}</code>, <code>{'{comment}'}</code>,{' '}
      <code>{'{locale}'}</code>.
    </div>
  )
}
