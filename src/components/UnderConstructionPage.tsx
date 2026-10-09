import Link from 'next/link'
import { buildLocalizedPath, type SupportedLocale } from '@/lib/localizedRouting'

const content = {
  es: {
    eyebrow: 'Próximamente',
    title: 'Esta página está en desarrollo',
    description: 'Estamos preparando algo especial. Vuelve pronto para descubrirlo.',
    home: 'Ir a la página principal',
  },
  en: {
    eyebrow: 'Coming soon',
    title: 'This page is under construction',
    description: 'We are preparing something special. Please check back soon.',
    home: 'Go to homepage',
  },
  uk: {
    eyebrow: 'Незабаром',
    title: 'Ця сторінка в розробці',
    description: 'Ми готуємо для вас дещо особливе. Завітайте трохи згодом.',
    home: 'На головну',
  },
} satisfies Record<SupportedLocale, {
  eyebrow: string
  title: string
  description: string
  home: string
}>

export default function UnderConstructionPage({ locale }: { locale: SupportedLocale }) {
  const copy = content[locale]

  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-[#fafafa] px-5 py-16">
      <div className="w-full max-w-[620px] border border-[#3c5557]/10 bg-white px-8 py-14 text-center shadow-sm max-[767px]:px-6 max-[767px]:py-10">
        <p className="mb-5 text-[13px] font-medium uppercase tracking-[0.18em] text-[#909da2]">{copy.eyebrow}</p>
        <h1 className="mb-5 text-[32px] font-semibold leading-tight text-[#3c5557] max-[767px]:text-[26px]">{copy.title}</h1>
        <p className="mx-auto mb-9 max-w-[440px] text-[16px] leading-relaxed text-[#505a5e]">{copy.description}</p>
        <Link
          href={buildLocalizedPath(locale, '/')}
          className="inline-flex min-h-[44px] items-center justify-center rounded-[10px] bg-[#3c5557] px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#2d4143]"
        >
          {copy.home}
        </Link>
      </div>
    </section>
  )
}
