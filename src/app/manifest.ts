import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dental Clinic Sulyhan',
    short_name: 'Sulyhan',
    description: 'Dental Clinic Sulyhan',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafafa',
    theme_color: '#fafafa',
    icons: [
      {
        src: '/api/favicon/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/api/favicon/512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
