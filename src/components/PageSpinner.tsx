import React from 'react'

type PageSpinnerProps = {
  label?: string
  className?: string
  sizeClassName?: string
  fullScreen?: boolean
}

export default function PageSpinner({
  label = 'Loading...',
  className = '',
  sizeClassName = 'h-10 w-10',
  fullScreen = false,
}: PageSpinnerProps) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center gap-4 text-center text-[#6b7478]',
        fullScreen ? 'min-h-[calc(100vh-70px)] px-[20px] py-[60px]' : 'px-6 py-10',
        className,
      ].join(' ')}
      role="status"
      aria-live="polite"
    >
      <div className="relative">
        <div
          className={`${sizeClassName} rounded-full border-[2px] border-[#d8dee2] border-t-[#22282b] animate-[spin_0.85s_linear_infinite]`}
        />
      </div>
      <p className="text-[14px] font-medium tracking-[0.01em]">{label}</p>
    </div>
  )
}
