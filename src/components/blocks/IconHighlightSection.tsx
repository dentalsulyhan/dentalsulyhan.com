import type { ComponentType } from 'react'
import { getBlockTheme, getThemeBackgroundStyle } from '@/lib/blockThemes'
import ContentIcon from '../ContentIcon'

export type IconHighlightBlockData = {
  id?: string | null
  theme?: string | null
  compactSpacing?: boolean | null
  iconSource?: string | null
  icon?: unknown
  fontAwesomeIcon?: string | null
  title?: string | null
  content?: unknown
}

export default function IconHighlightSection({
  block,
  RichText,
}: {
  block: IconHighlightBlockData
  RichText: ComponentType<{ data: never }>
}) {
  const theme = getBlockTheme(block.theme || 'soft')
  const hasIcon = Boolean(block.icon || block.fontAwesomeIcon)

  return (
    <section
      className={
        block.compactSpacing
          ? `py-[100px] max-[767px]:py-[48px] ${theme.section}`
          : `py-[150px] max-[991px]:py-[100px] max-[767px]:py-[64px] ${theme.section}`
      }
      style={getThemeBackgroundStyle(theme, 'section')}
    >
      <div
        className={`max-w-[1200px] mx-auto px-[30px] max-[1100px]:px-[24px] max-[767px]:px-[20px] grid items-center gap-x-[60px] max-[991px]:gap-x-[40px] max-[767px]:grid-cols-1 max-[767px]:gap-y-6 ${
          hasIcon ? 'grid-cols-[minmax(0,1fr)_1px_minmax(0,745px)] max-[991px]:grid-cols-[auto_1px_minmax(0,1fr)]' : 'grid-cols-[minmax(0,745px)] justify-center'
        }`}
      >
        {hasIcon && (
          <>
            <div className="flex justify-center max-[767px]:justify-start">
              <ContentIcon
                icon={block.icon}
                iconSource={block.iconSource}
                fontAwesomeIcon={block.fontAwesomeIcon}
                alt={block.title || ''}
                size={112}
                imageClassName="w-[112px] h-[112px] object-contain max-[991px]:w-[80px] max-[991px]:h-[80px] max-[767px]:w-[64px] max-[767px]:h-[64px]"
                iconClassName="text-[#22282b] [&_svg]:w-[84px] [&_svg]:h-[84px] max-[991px]:[&_svg]:w-[64px] max-[991px]:[&_svg]:h-[64px] max-[767px]:[&_svg]:w-[52px] max-[767px]:[&_svg]:h-[52px]"
              />
            </div>
            <div aria-hidden="true" className="w-px self-stretch min-h-[216px] bg-[#22282b] max-[767px]:hidden" />
          </>
        )}
        <div className="min-w-0">
          {block.title && (
            <h2 className="text-[32px] max-[767px]:text-[24px] font-semibold text-[#22282b] text-left mb-6 max-[767px]:mb-4">
              {block.title}
            </h2>
          )}
          {Boolean(block.content) && (
            <div className="mobile-richtext-left prose max-w-none text-left text-[#22282b] [&_p]:text-left [&_li]:text-left">
              <RichText data={block.content as never} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
