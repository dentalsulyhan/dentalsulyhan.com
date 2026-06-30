import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { makeLexicalFromPlainText, normalizeLexicalValue } from '@/lib/lexical'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getMessages(locale: 'es' | 'en' | 'uk') {
  if (locale === 'uk') {
    return {
      required: 'Будь ласка, заповніть усі обов’язкові поля.',
      email: 'Будь ласка, введіть коректний email.',
      captcha: 'Підтвердіть, що ви не робот.',
      captchaFailed: 'Перевірка Cloudflare Turnstile не пройдена.',
      failed: 'Не вдалося надіслати форму.',
    }
  }

  if (locale === 'en') {
    return {
      required: 'Please fill in all required fields.',
      email: 'Please enter a valid email address.',
      captcha: 'Please confirm that you are not a robot.',
      captchaFailed: 'Cloudflare Turnstile verification failed.',
      failed: 'Failed to submit the form.',
    }
  }

  return {
    required: 'Por favor, complete todos los campos obligatorios.',
    email: 'Por favor, introduzca un email valido.',
    captcha: 'Confirme que no es un robot.',
    captchaFailed: 'La verificacion de Cloudflare Turnstile ha fallado.',
    failed: 'No se pudo enviar el formulario.',
  }
}

async function verifyTurnstileToken(token: string, remoteIp?: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true

  const body = new URLSearchParams({
    secret,
    response: token,
  })

  if (remoteIp) {
    body.set('remoteip', remoteIp)
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  if (!response.ok) return false

  const result = (await response.json()) as { success?: boolean }
  return Boolean(result.success)
}

function applyTemplate(
  template: string,
  data: Record<'fullName' | 'phone' | 'email' | 'patientType' | 'referralSource' | 'comment' | 'locale', string>,
) {
  return template.replace(/\{(fullName|phone|email|patientType|referralSource|comment|locale)\}/g, (_, key) => {
    return data[key as keyof typeof data] || ''
  })
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function linkify(value: string) {
  return value.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#3c5557;text-decoration:underline" target="_blank" rel="noopener noreferrer">$1</a>')
}

function renderEmailBody(template: string) {
  const lines = template.split('\n')
  const blocks: string[] = []
  let paragraph: string[] = []
  let list: string[] = []

  const flushParagraph = () => {
    if (!paragraph.length) return
    blocks.push(
      `<p style="margin:0 0 16px;color:#22282b;font-size:16px;line-height:1.7;">${linkify(
        escapeHtml(paragraph.join(' ')),
      )}</p>`,
    )
    paragraph = []
  }

  const flushList = () => {
    if (!list.length) return
    blocks.push(
      `<ul style="margin:0 0 16px;padding-left:20px;color:#22282b;font-size:16px;line-height:1.7;">${list
        .map((item) => `<li style="margin:0 0 8px;">${linkify(escapeHtml(item))}</li>`)
        .join('')}</ul>`,
    )
    list = []
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (!line) {
      flushParagraph()
      flushList()
      continue
    }

    if (/^[-•]\s+/.test(line)) {
      flushParagraph()
      list.push(line.replace(/^[-•]\s+/, ''))
      continue
    }

    flushList()
    paragraph.push(line)
  }

  flushParagraph()
  flushList()

  return blocks.join('')
}

function renderTemplateToHTML(template: unknown, data: Record<'fullName' | 'phone' | 'email' | 'patientType' | 'referralSource' | 'comment' | 'locale', string>) {
  if (typeof template === 'string') {
    return renderEmailBody(applyTemplate(template, data))
  }

  if (template && typeof template === 'object' && 'root' in template) {
    const html = convertLexicalToHTML({
      data: normalizeLexicalValue(template) as Parameters<typeof convertLexicalToHTML>[0]['data'],
      disableContainer: true,
    })

    return applyTemplate(html, data)
  }

  return ''
}

export async function POST(request: Request) {
  let locale: 'es' | 'en' | 'uk' = 'es'

  try {
    const payload = await getPayload({ config: configPromise })
    const body = (await request.json()) as Record<string, unknown>

    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const patientType = typeof body.patientType === 'string' ? body.patientType.trim() : ''
    const referralSource = typeof body.referralSource === 'string' ? body.referralSource.trim() : ''
    const comment = typeof body.comment === 'string' ? body.comment.trim() : ''
    const turnstileToken = typeof body.turnstileToken === 'string' ? body.turnstileToken.trim() : ''
    locale = body.locale === 'en' || body.locale === 'uk' || body.locale === 'es' ? body.locale : 'es'
    const messages = getMessages(locale)
    const templateData = {
      fullName,
      phone,
      email,
      patientType,
      referralSource,
      comment,
      locale,
    }

    if (!fullName || !phone || !email || !patientType || !referralSource) {
      return Response.json({ error: messages.required }, { status: 400 })
    }

    if (!emailPattern.test(email)) {
      return Response.json({ error: messages.email }, { status: 400 })
    }

    if (process.env.TURNSTILE_SECRET_KEY) {
      if (!turnstileToken) {
        return Response.json({ error: messages.captcha }, { status: 400 })
      }

      const forwardedFor = request.headers.get('x-forwarded-for')
      const remoteIp = forwardedFor ? forwardedFor.split(',')[0]?.trim() : null
      const isValidTurnstile = await verifyTurnstileToken(turnstileToken, remoteIp)

      if (!isValidTurnstile) {
        return Response.json({ error: messages.captchaFailed }, { status: 400 })
      }
    }

    await payload.create({
      collection: 'contact-submissions',
      data: {
        fullName,
        phone,
        email,
        patientType,
        referralSource,
        comment,
        locale,
      },
    })

    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
      locale,
    })

    const recipientEmail = siteSettings?.formNotifications?.recipientEmail || siteSettings?.contacts?.email

    const adminSubjectTemplate =
      siteSettings?.formNotifications?.adminSubject ||
      (locale === 'uk'
        ? 'Нова заявка з сайту від {fullName}'
        : locale === 'en'
          ? 'New website contact request from {fullName}'
          : 'Nueva solicitud web de {fullName}')

    const adminMessageTemplate =
      siteSettings?.formNotifications?.adminMessage ||
      makeLexicalFromPlainText(
        locale === 'uk'
          ? 'Нова заявка з сайту.\n\nПІБ: {fullName}\nТелефон: {phone}\nEmail: {email}\nТип пацієнта: {patientType}\nЗвідки дізнався: {referralSource}\nКоментар: {comment}\nМова: {locale}'
          : locale === 'en'
            ? 'New website form submission.\n\nFull name: {fullName}\nPhone: {phone}\nEmail: {email}\nPatient type: {patientType}\nHow they heard about you: {referralSource}\nComment: {comment}\nLocale: {locale}'
            : 'Nueva solicitud desde el sitio.\n\nNombre completo: {fullName}\nTelefono: {phone}\nEmail: {email}\nTipo de paciente: {patientType}\nComo nos conocio: {referralSource}\nComentario: {comment}\nIdioma: {locale}',
      )

    const userSubjectTemplate =
      siteSettings?.formNotifications?.userSubject ||
      (locale === 'uk'
        ? 'Ми отримали вашу заявку'
        : locale === 'en'
          ? 'We received your request'
          : 'Hemos recibido su solicitud')

    const userMessageTemplate =
      siteSettings?.formNotifications?.userMessage ||
      makeLexicalFromPlainText(
        locale === 'uk'
          ? 'Дякуємо, {fullName}.\n\nМи отримали вашу заявку і зв’яжемося з вами найближчим часом.'
          : locale === 'en'
            ? 'Thank you, {fullName}.\n\nWe have received your request and will contact you shortly.'
            : 'Gracias, {fullName}.\n\nHemos recibido su solicitud y nos pondremos en contacto con usted pronto.',
      )

    if (recipientEmail) {
      await payload.sendEmail({
        to: recipientEmail,
        subject: applyTemplate(adminSubjectTemplate, templateData),
        html: `
          <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:32px 24px;background:#fbf6f3;border-radius:20px;">
            ${renderTemplateToHTML(adminMessageTemplate, templateData)}
          </div>
        `,
      })
    }

    if (siteSettings?.formNotifications?.sendConfirmationToUser !== false) {
      await payload.sendEmail({
        to: email,
        subject: applyTemplate(userSubjectTemplate, templateData),
        html: `
          <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:32px 24px;background:#fbf6f3;border-radius:20px;">
            ${renderTemplateToHTML(userMessageTemplate, templateData)}
          </div>
        `,
      })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Contact form submission failed:', error)

    return Response.json({ error: getMessages(locale).failed }, { status: 500 })
  }
}
