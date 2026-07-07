'use client'

import dynamic from 'next/dynamic'
import type { TeamMember } from '@/payload-types'

const TeamSlider = dynamic(() => import('./TeamSlider'), {
  ssr: false,
  loading: () => <div className="min-h-[280px] w-full rounded-[20px] bg-[#e8e0d8]" aria-hidden="true" />,
})

export default function LazyTeamSlider({ members }: { members: TeamMember[] }) {
  return <TeamSlider members={members} />
}
