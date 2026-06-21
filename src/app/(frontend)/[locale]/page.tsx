import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })

  // Отримуємо контент Головної сторінки з бази для конкретної мови
  const homeData = await payload.findGlobal({
    slug: 'home-page',
    locale: locale as 'es' | 'en' | 'uk',
  })

  return (
    <div className="max-w-7xl mx-auto px-6 mt-12">
      {/* Головний блок (Hero) */}
      <section className="text-center max-w-4xl mx-auto py-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-blue-950">
          {homeData.hero?.title || 'Clínica dental Sulyhan'}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {homeData.hero?.subtitle}
        </p>
        <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition">
          {homeData.hero?.buttonText || 'Pide tu cita'}
        </button>
      </section>

      {/* Блок переваг (Diagnóstico honesto тощо) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
        {homeData.advantages?.map((adv, index) => (
          <div key={index} className="bg-blue-50 p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-4 text-blue-900">{adv.title}</h3>
            <p className="text-gray-600">{adv.description}</p>
          </div>
        ))}
      </section>
    </div>
  )
}