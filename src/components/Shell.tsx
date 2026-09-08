import type { ReactNode } from 'react'

// The PS2 "system window" chrome that frames the interactive area.
export default function Shell({
  title = 'davvn_buildMode.exe',
  slot = 'memory card \u00b7 slot 01',
  children,
}: {
  title?: string
  slot?: string
  children: ReactNode
}) {
  return (
    <div className="sys">
      <div className="sys-h mono">
        <span className="lamp" />
        <span>{title}</span>
        <span className="mcslot">{slot}</span>
      </div>
      <div className="stage">{children}</div>
    </div>
  )
}
