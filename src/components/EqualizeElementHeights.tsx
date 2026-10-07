'use client'

import { useEffect } from 'react'

type EqualizeElementHeightsProps = {
  selector: string
  minWidth?: number
}

export default function EqualizeElementHeights({ selector, minWidth = 992 }: EqualizeElementHeightsProps) {
  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${minWidth}px)`)
    let frameId: number | null = null

    const getElements = () => Array.from(document.querySelectorAll<HTMLElement>(selector))

    const equalize = () => {
      frameId = null
      const elements = getElements()

      elements.forEach((element) => {
        element.style.minHeight = ''
      })

      if (!mediaQuery.matches || elements.length < 2) return

      const tallestHeight = Math.ceil(Math.max(...elements.map((element) => element.getBoundingClientRect().height)))

      elements.forEach((element) => {
        element.style.minHeight = `${tallestHeight}px`
      })
    }

    const scheduleEqualize = () => {
      if (frameId !== null) cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(equalize)
    }

    const observer = new ResizeObserver(scheduleEqualize)
    getElements().forEach((element) => observer.observe(element))
    mediaQuery.addEventListener('change', scheduleEqualize)
    window.addEventListener('resize', scheduleEqualize)
    scheduleEqualize()

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId)
      observer.disconnect()
      mediaQuery.removeEventListener('change', scheduleEqualize)
      window.removeEventListener('resize', scheduleEqualize)
      getElements().forEach((element) => {
        element.style.minHeight = ''
      })
    }
  }, [minWidth, selector])

  return null
}
