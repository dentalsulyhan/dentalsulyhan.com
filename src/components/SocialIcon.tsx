type SocialIconProps = {
  platform: string
}

export default function SocialIcon({ platform }: SocialIconProps) {
  const iconMap: Record<string, string> = {
    instagram: '/icons/instagram.svg',
    facebook: '/icons/facebook.svg',
    twitter: '/icons/twitter.svg',
  }
  const iconSrc = iconMap[platform]

  if (iconSrc) {
    return <img src={iconSrc} alt="" aria-hidden="true" className="w-[20px] h-[20px]" />
  }

  if (platform === 'youtube') {
    return (
      <svg aria-hidden="true" className="w-[20px] h-[20px] fill-[#22282b]" viewBox="0 0 24 24">
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555a3.003 3.003 0 0 0-2.11 2.108C0 8.017 0 12 0 12s0 3.983.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.983 24 12 24 12s0-3.983-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    )
  }

  if (platform === 'tiktok') {
    return (
      <svg aria-hidden="true" className="w-[20px] h-[20px] fill-[#22282b]" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.58 4.22.95 1.1 2.27 1.83 3.73 2.05v3.83c-1.39-.03-2.74-.51-3.87-1.37a8.09 8.09 0 0 1-2.22-2.58v9.42c.04 1.48-.3 2.96-1.01 4.26-.71 1.29-1.78 2.37-3.08 3.08a8.312 8.312 0 0 1-8.52 0A8.09 8.09 0 0 1 .74 19.86a8.21 8.21 0 0 1 0-8.52c.71-1.29 1.78-2.37 3.08-3.08a8.32 8.32 0 0 1 7.21-.49c.03.65.01 1.31.02 1.97-.68-.2-1.4-.23-2.1-.08a4.11 4.11 0 0 0-3.13 3.13c-.22.94-.12 1.93.28 2.8.39.87 1.09 1.58 1.96 1.97a4.17 4.17 0 0 0 4.14 0 4.2 4.2 0 0 0 1.97-1.97 4.131 4.131 0 0 0-.01-4.14V.02z" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" className="w-[20px] h-[20px] stroke-[#22282b]" fill="none" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.07.07l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 11a5 5 0 0 0-7.07-.07l-2 2A5 5 0 0 0 12 20l1.15-1.15" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
