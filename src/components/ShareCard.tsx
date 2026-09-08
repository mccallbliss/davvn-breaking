import type { SongId } from '../lib/songs'
import { SONGS } from '../lib/songs'
import { archOf, isGlitch } from '../lib/archetypes'
import { pretty } from '../lib/cutcode'

// The 9:16 "memory card export" modal, screenshot-ready for stories.
export default function ShareCard({
  order,
  onClose,
}: {
  order: SongId[]
  onClose: () => void
}) {
  const glitch = isGlitch(order)
  const a = archOf(order)
  const code = pretty(order)
  const bg = glitch
    ? 'repeating-linear-gradient(90deg,#0d0709,#0d0709 3px,rgba(154,59,52,.10) 3px,rgba(154,59,52,.10) 4px),linear-gradient(160deg,#170d0f,#0a0607)'
    : `linear-gradient(158deg, ${a.c}, #0a0f11)`
  const nameStyle = glitch
    ? { color: '#d98a84', textShadow: '2px 0 #9a3b34, -2px 0 #2f6d78' }
    : undefined

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div>
        <div className="scard" style={{ background: bg }}>
          <div className="sgrain" />
          <div className="modal-actions">
            <button className="cpy" onClick={onClose}>{'\u2715'} close</button>
          </div>
          <div className="stop">
            <div className="brand">DAVVN</div>
            <div className="sh">{a.k} {'\u00b7'} save data</div>
            <h3 className="serif" style={nameStyle}>{a.n}</h3>
            <div className="stag serif">&ldquo;{a.tag}&rdquo;</div>
          </div>
          <ol className="slist">
            {order.map((id, i) => (
              <li key={i}>
                <span className="sn">{String(i + 1).padStart(2, '0')}</span>
                <span>{SONGS[id].title}</span>
              </li>
            ))}
          </ol>
          <div className="sfoot">
            <span>
              {code}
              <small>copy to a friend</small>
            </span>
            <span style={{ textAlign: 'right' }}>
              davvn.com
              <small>which are you?</small>
            </span>
          </div>
        </div>
        <div className="mhint mono">screenshot for your story {'\u00b7'} tag @davvn</div>
      </div>
    </div>
  )
}
