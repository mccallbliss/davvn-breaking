import type { MouseEvent } from 'react'
import type { SongId } from '../lib/songs'
import { SONGS } from '../lib/songs'
import { archOf, isGlitch } from '../lib/archetypes'
import { firstNote } from '../lib/frames'
import { pretty, codeOf } from '../lib/cutcode'
import { computeRead, readPos, readLine, variantOf, GLITCH_VARIANT } from '../lib/read'

function playtime(o: SongId[]): string {
  const letters: Record<string, number> = {
    D: 68, F: 70, L: 76, T: 84, W: 87, B: 66,
  }
  const code = codeOf(o)
  const s = code.split('').reduce((a, ch, i) => a + (letters[ch] || 70) * (i + 1), 0)
  const mm = String(s % 53).padStart(2, '0')
  const ss = String((s * 7) % 60).padStart(2, '0')
  return `00:${mm}:${ss}`
}

function role(i: number, last: number) {
  if (i === 0) return <span className="role">opener</span>
  if (i === 1) return <span className="role">the floor</span>
  if (i === last) return <span className="role">closer</span>
  return null
}

// The result "save file" for a finished order.
export default function SaveFile({
  order,
  shareLink,
  onExport,
}: {
  order: SongId[]
  shareLink: string
  onExport: () => void
}) {
  const glitch = isGlitch(order)
  const a = archOf(order)
  const code = pretty(order)
  const read = computeRead(order)
  const pos = readPos(read)
  const v = glitch ? GLITCH_VARIANT : variantOf(order)
  const thumbBg = glitch ? undefined : `linear-gradient(155deg, ${a.c}, #0b1114)`
  const thumbChar = glitch ? '\u258a' : a.n[4] || a.n[0]

  const copy = (text: string, e: MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget
    if (navigator.clipboard) navigator.clipboard.writeText(text)
    const prev = btn.textContent
    btn.textContent = 'copied \u2713'
    setTimeout(() => {
      btn.textContent = prev
    }, 1400)
  }

  return (
    <>
      <div className={`save${glitch ? ' corrupt' : ''}`}>
        <div className="save-h">
          <div className="thumb" style={{ background: thumbBg }}>
            {thumbChar}
          </div>
          <div className="meta">
            <div className="fk mono">{a.k} {'\u00b7'} save file</div>
            <h2 className="serif">{a.n}</h2>
            <div className="tag serif">&ldquo;{a.tag}&rdquo;</div>
            {v.sub && <div className="vsub mono">{v.sub}</div>}
            <div className="stamp mono">saved oct 2026 {'\u00b7'} play time {playtime(order)}</div>
          </div>
        </div>
        <div className="save-body">
          <p className="desc">{a.p}</p>
          <p className="first serif">{firstNote(order[2])}</p>

          <div className="readblk">
            <div className="rlab mono">the read</div>
            <div className="rmeters mono">
              <div className="rmeter">
                <span>reach</span>
                <div className="rbar"><i style={{ left: `${pos.a}%` }} /></div>
                <span>let go</span>
              </div>
              <div className="rmeter">
                <span>back</span>
                <div className="rbar warm"><i style={{ left: `${pos.b}%` }} /></div>
                <span>forward</span>
              </div>
            </div>
            <div className="rline serif">{readLine(read)}</div>
            <div className="rcoda serif">{v.coda}</div>
          </div>

          <ul className="tl">
            {order.map((id, i) => (
              <li key={i}>
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                <span className="st">{SONGS[id].title}</span>
                {role(i, order.length - 1)}
              </li>
            ))}
          </ul>
          <div className="expbox">
            <div className="row">
              <span>
                <span className="lbl">save code</span>
                <span className="val">{code}</span>
              </span>
              <button className="cpy" onClick={(e) => copy(code, e)}>copy</button>
            </div>
            <div className="row">
              <span>
                <span className="lbl">memory card link {'\u00b7'} opens straight to this save</span>
                <span className="val">{shareLink}</span>
              </span>
              <button className="cpy" onClick={(e) => copy(shareLink, e)}>copy</button>
            </div>
          </div>
        </div>
      </div>
      <div className="btnrow">
        <button className="btn primary" onClick={onExport}>{'\u25a4'} Export save</button>
      </div>
    </>
  )
}
