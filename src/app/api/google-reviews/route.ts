import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'

const FEATURABLE_ID = '085c3d78-9394-4d4f-8aa3-c9488d6086c7'
const REVIEWS_REVALIDATE = 3600

const getGoogleReviews = unstable_cache(
  async () => {
    const response = await fetch(`https://api.featurable.com/v2/widgets/${FEATURABLE_ID}`, {
      method: 'GET',
      next: { revalidate: REVIEWS_REVALIDATE },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch Google reviews: ${response.status}`)
    }

    return response.json()
  },
  ['google-reviews-widget'],
  {
    revalidate: REVIEWS_REVALIDATE,
    tags: ['google-reviews-widget'],
  },
)

export async function GET() {
  try {
    const data = await getGoogleReviews()

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': `public, s-maxage=${REVIEWS_REVALIDATE}, stale-while-revalidate=86400`,
      },
    })
  } catch (error) {
    console.error('Error fetching Google reviews widget:', error)
    return NextResponse.json(
      { success: false, widget: null },
      {
        status: 502,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      },
    )
  }
}
