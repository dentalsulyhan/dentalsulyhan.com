import type { ComponentType, CSSProperties } from 'react'
import { getBlockTheme, getThemeBackgroundStyle } from '@/lib/blockThemes'
import ContentIcon from '../ContentIcon'

type RichTextData = never

export type TimelineBlockData = {
  id?: string | null
  theme?: string | null
  compactSpacing?: boolean | null
  sectionTitle?: string | null
  items?:
    | Array<{
        id?: string | null
        iconSource?: string | null
        icon?: unknown
        fontAwesomeIcon?: string | null
        title: string
        text?: unknown
      }>
    | null
}

const DESKTOP_GAP_PX = 18

export default function TimelineSection({
  block,
  RichText,
}: {
  block: TimelineBlockData
  RichText: ComponentType<{ data: RichTextData }>
}) {
  const theme = getBlockTheme(block.theme)
  const items = block.items || []
  const columns = Math.min(Math.max(items.length, 1), 6)
  // Horizontal connector runs between the centers of the first and last circles.
  const connectorInset = `calc((100% - ${(columns - 1) * DESKTOP_GAP_PX}px) / ${columns * 2})`
  const gridStyle = {
    '--timeline-columns': `repeat(${columns}, minmax(0, 1fr))`,
    columnGap: `${DESKTOP_GAP_PX}px`,
  } as CSSProperties

  return (
    <section
      className={block.compactSpacing ? `py-[50px] max-[767px]:py-[32px] ${theme.section}` : `py-[100px] max-[767px]:py-[64px] ${theme.section}`}
      style={getThemeBackgroundStyle(theme, 'section')}
    >
      <div className="max-w-[1200px] mx-auto px-[30px] max-[1100px]:px-[24px] max-[767px]:px-[20px]">
        {block.sectionTitle && (
          <h2 className="text-[32px] max-[767px]:text-[24px] font-semibold text-[#22282b] text-center mb-[36px] max-[767px]:mb-8">
            {block.sectionTitle}
          </h2>
        )}
        <div className="relative">
        {items.length > 1 && (
          <div
            aria-hidden="true"
            className="absolute top-[41px] h-[10px] bg-[#eceeef] max-[991px]:hidden"
            style={{ left: connectorInset, right: connectorInset }}
          />
        )}
        <ol
          className="relative grid list-none p-0 m-0 min-[992px]:[grid-template-columns:var(--timeline-columns)] max-[991px]:grid-cols-1"
          style={gridStyle}
        >
          {items.map((item, itemIndex) => {
            const isLast = itemIndex === items.length - 1
            const hasIcon = Boolean(item.icon || item.fontAwesomeIcon)
            return (
              <li
                key={item.id || itemIndex}
                className="relative flex flex-col items-center min-w-0 max-[991px]:flex-row max-[991px]:items-start max-[991px]:gap-5 max-[991px]:pb-8 max-[991px]:last:pb-0"
              >
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="hidden max-[991px]:block absolute left-[29px] top-[64px] bottom-0 w-[6px] bg-[#eceeef]"
                  />
                )}
                <div className="relative z-10 w-[92px] h-[92px] rounded-full bg-[#eceeef] flex items-center justify-center shrink-0 max-[991px]:w-[64px] max-[991px]:h-[64px]">
                  {hasIcon && (
                    <ContentIcon
                      icon={item.icon}
                      iconSource={item.iconSource}
                      fontAwesomeIcon={item.fontAwesomeIcon}
                      alt={item.title}
                      size={48}
                      imageClassName="w-[48px] h-[48px] object-contain max-[991px]:w-[34px] max-[991px]:h-[34px]"
                      iconClassName="text-[#22282b] [&_svg]:w-[40px] [&_svg]:h-[40px] max-[991px]:[&_svg]:w-[28px] max-[991px]:[&_svg]:h-[28px]"
                    />
                  )}
                </div>
                <div className="w-full min-w-0 max-[991px]:pt-[6px]">
                  <h3 className="mt-[30px] mb-0 text-[20px] leading-6 font-semibold tracking-[-0.01em] text-[#22282b] text-center max-[991px]:mt-0 max-[991px]:text-left">
                    {item.title}
                  </h3>
                  {Boolean(item.text) && (
                    <div className="mt-[22px] prose max-w-none text-left text-[#22282b] [&_p]:text-left [&_p]:text-[14px] [&_p]:leading-[28px] [&_li]:text-[14px] [&_li]:leading-[28px] max-[991px]:mt-3">
                      <RichText data={item.text as never} />
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
        </div>
      </div>
    </section>
  )
}
