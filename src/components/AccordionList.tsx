'use client'

import { useId, useState } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState, SerializedLexicalNode } from '@payloadcms/richtext-lexical/lexical'

type AccordionItem = {
  id?: string | null
  heading?: string | null
  content?: SerializedEditorState<SerializedLexicalNode> | null
}

type AccordionListProps = {
  items?: AccordionItem[] | null
  columns?: 1 | 2
  contentClassName?: string
  headingClassName?: string
  iconClassName?: string
  itemClassName?: string
}

export default function AccordionList({
  items,
  columns = 1,
  contentClassName = '',
  headingClassName = '',
  iconClassName = '',
  itemClassName = '',
}: AccordionListProps) {
  const listId = useId()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!items?.length) return null

  return (
    <div className={columns === 2 ? 'grid grid-cols-2 gap-4 items-start max-[767px]:grid-cols-1' : 'flex flex-col gap-4'}>
      {items.map((item, itemIndex) => {
        const isOpen = openIndex === itemIndex
        const panelId = `${listId}-panel-${itemIndex}`

        return (
          <div key={item.id || itemIndex} className={itemClassName}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              aria-label={item.heading || `Accordion item ${itemIndex + 1}`}
              onClick={() => setOpenIndex(isOpen ? null : itemIndex)}
              className={`w-full flex items-center justify-between gap-4 text-left ${headingClassName}`}
            >
              <span>{item.heading}</span>
              <span
                className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''} ${iconClassName}`}
              >
                +
              </span>
            </button>
            <div
              id={panelId}
              className={`grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className={contentClassName}>
                  {item.content ? <RichText data={item.content} /> : null}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
