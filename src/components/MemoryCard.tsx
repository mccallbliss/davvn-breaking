import type { SongId } from '../lib/songs'
import { SONGS } from '../lib/songs'

// The memory-card readout that fills as the order is built.
export default function MemoryCard({ order }: { order: SongId[] }) {
  const rows = Array.from({ length: 6 }, (_, i) => order[i])
  return (
    <div className="mc">
      <div className="mc-h mono">
        <span>{'\u25fc'} save data {'\u00b7'} davvn.exe</span>
        <span>{String(order.length).padStart(2, '0')}/06 blocks</span>
      </div>
      <div className="mc-blocks">
        {rows.map((id, i) => (
          <i key={i} className={id ? 'on' : ''} />
        ))}
      </div>
      <ul className="mc-list mono">
        {rows.map((id, i) => (
          <li key={i}>
            <span className="n">{String(i + 1).padStart(2, '0')}</span>
            {id ? (
              <span>{SONGS[id].title}</span>
            ) : (
              <span className="empty">{'\u2014 empty \u2014'}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
