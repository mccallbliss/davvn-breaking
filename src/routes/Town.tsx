import { useLayoutEffect, useReducer, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { SongId } from '../lib/songs'
import { SONGS } from '../lib/songs'
import { ARCH } from '../lib/archetypes'
import type { NodeId } from '../lib/town'
import { TOWN_NODES, TOWN_EDGES, THRESHOLD, STATUS, neighbors } from '../lib/town'

type Target = NodeId | 'exit'

interface S {
  current: NodeId
  visited: NodeId[]
  revealed: NodeId[]
  exitOn: boolean
  exitPos: { x: number; y: number } | null
  lastTrack: SongId | null
  left: boolean
  status: string
}

type Action = { type: 'travel'; id: Target } | { type: 'reset' }

function reveal(rev: NodeId[], id: NodeId): NodeId[] {
  const s = new Set(rev)
  s.add(id)
  neighbors(id).forEach((n) => s.add(n))
  return [...s]
}
function trackCount(visited: NodeId[]): number {
  return visited.filter((v) => TOWN_NODES[v].track).length
}
function init(): S {
  return {
    current: 'home',
    visited: ['home'],
    revealed: reveal([], 'home'),
    exitOn: false,
    exitPos: null,
    lastTrack: null,
    left: false,
    status: "you're home. the fog only lifts where you go.",
  }
}
function reducer(s: S, a: Action): S {
  if (a.type === 'reset') return init()
  if (a.id === 'exit') {
    return { ...s, left: true, exitOn: false, status: 'you followed the road out. the town closes behind you.' }
  }
  const node = TOWN_NODES[a.id]
  const visited = [...s.visited, a.id]
  const revealed = reveal(s.revealed, a.id)
  const lastTrack = node.track ?? s.lastTrack
  let exitOn = s.exitOn
  let exitPos = s.exitPos
  let status = node.track ? STATUS[node.track] : 'you move deeper into the fog.'
  if (trackCount(visited) >= THRESHOLD && !exitOn) {
    exitOn = true
    exitPos = { x: Math.max(8, Math.min(92, node.x)), y: node.y > 50 ? 95 : 5 }
    status = 'the fog thins at the edge of town. you could leave now.'
  }
  return { ...s, current: a.id, visited, revealed, lastTrack, exitOn, exitPos, status, left: false }
}

export default function Town() {
  const [st, dispatch] = useReducer(reducer, undefined, init)
  const boxRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useLayoutEffect(() => {
    const el = boxRef.current
    if (!el) return
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { w, h } = size
  const pos = (id: Target) => {
    if (id === 'exit') {
      const e = st.exitPos ?? { x: 50, y: 50 }
      return { x: (e.x / 100) * w, y: (e.y / 100) * h }
    }
    const n = TOWN_NODES[id]
    return { x: (n.x / 100) * w, y: (n.y / 100) * h }
  }

  const reach = new Set<Target>()
  neighbors(st.current).forEach((n) => {
    if (!st.visited.includes(n) && st.revealed.includes(n)) reach.add(n)
  })
  if (st.exitOn) reach.add('exit')

  const showIds: Target[] = [...st.revealed]
  if (st.exitOn) showIds.push('exit')
  const holeR = Math.min(w, h) * 0.24

  const stops = st.visited.filter((v) => TOWN_NODES[v].track)
  const ending = st.lastTrack && st.lastTrack !== 'lifeless' ? ARCH[st.lastTrack] : null

  const go = (id: Target) => dispatch({ type: 'travel', id })

  return (
    <div className="townwrap">
      <header className="townhead">
        <div className="kick mono">tier 2 · the town</div>
        <h1 className="serif">The town</h1>
        <p className="lede">
          Each track is a place. You move through a fogbound town — the map only clears around where
          you've walked. Every route out is a different order, and a different ending.
        </p>
      </header>

      <div className="status serif">{st.status}</div>

      <div className="maproom" ref={boxRef}>
        {w > 0 && (
          <svg className="mapsvg" viewBox={`0 0 ${w} ${h}`}>
            {/* faint printed streets */}
            {TOWN_EDGES.map(([a, b], i) => {
              const p = pos(a)
              const q = pos(b)
              return (
                <line key={'e' + i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#2a3d47" strokeWidth={1.2} strokeOpacity={0.55} />
              )
            })}
            {/* exit road */}
            {st.exitOn && (() => {
              const p = pos(st.current)
              const q = pos('exit')
              return <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#6b5f33" strokeWidth={1.6} strokeDasharray="5 5" strokeOpacity={0.8} />
            })()}
            {/* walked route */}
            {st.visited.slice(1).map((id, i) => {
              const p = pos(st.visited[i])
              const q = pos(id)
              return <line key={'r' + i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#8fb3c4" strokeWidth={2.4} strokeOpacity={0.85} strokeLinecap="round" />
            })}
            {/* nodes */}
            {st.revealed.map((id) => {
              const p = pos(id)
              const isCur = id === st.current
              const isVis = st.visited.includes(id)
              const isReach = reach.has(id)
              return (
                <g key={'n' + id}>
                  <circle cx={p.x} cy={p.y} r={isCur ? 7 : 5} fill={isCur ? '#eaf6ff' : isVis ? '#5f7d8a' : '#26343a'} stroke={isReach ? '#7fa2b5' : '#0a0f11'} strokeWidth={isReach ? 2 : 1.4} />
                  {isReach && (
                    <circle cx={p.x} cy={p.y} r={11} fill="none" stroke="#7fa2b5" strokeWidth={1} strokeOpacity={0.5}>
                      <animate attributeName="r" values="8;15;8" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                </g>
              )
            })}
            {/* exit node */}
            {st.exitOn && (() => {
              const p = pos('exit')
              return <circle cx={p.x} cy={p.y} r={7} fill="#d9c47a" stroke="#0a0f11" strokeWidth={1.5} />
            })()}
            {/* fog-of-war */}
            <defs>
              <radialGradient id="townhole" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#000" stopOpacity={1} />
                <stop offset="50%" stopColor="#000" stopOpacity={1} />
                <stop offset="100%" stopColor="#fff" stopOpacity={1} />
              </radialGradient>
              <mask id="townmask">
                <rect width={w} height={h} fill="#fff" />
                {showIds.map((id) => {
                  const p = pos(id)
                  return <circle key={'m' + id} cx={p.x} cy={p.y} r={holeR} fill="url(#townhole)" />
                })}
              </mask>
            </defs>
            <rect width={w} height={h} fill="rgba(7,11,13,0.86)" mask="url(#townmask)" />
          </svg>
        )}

        {/* pins / labels */}
        <div className="pins">
          {showIds.map((id) => {
            const p = pos(id)
            const isVis = id !== 'exit' && st.visited.includes(id)
            const isReach = reach.has(id)
            const name = id === 'exit' ? 'town limits' : TOWN_NODES[id].name
            const track =
              id === 'exit'
                ? 'the way out'
                : TOWN_NODES[id].track
                  ? 'plays ' + SONGS[TOWN_NODES[id].track as SongId].title
                  : ''
            return (
              <div
                key={'p' + id}
                className={`pin${isVis ? ' visited' : ''}${isReach ? ' reach' : ''}${id === 'exit' ? ' exit' : ''}`}
                style={{ left: p.x, top: p.y - 22 }}
                onClick={isReach ? () => go(id) : undefined}
              >
                <div className="nm serif">{name}</div>
                {track && <div className="tk mono">{track}</div>}
                {isReach && <div className="pgo mono">▸ walk here</div>}
              </div>
            )
          })}
        </div>

        {w > 0 && (
          <div
            className="marker"
            style={{ left: pos(st.current).x, top: pos(st.current).y }}
          />
        )}
        <div className="compass mono">N ↑</div>
      </div>

      <div className="mc route-mc">
        <div className="mc-h mono">
          <span>{'\u25fc'} route · davvn.exe</span>
          <span>{String(stops.length).padStart(2, '0')} stops</span>
        </div>
        <ul className="mc-list mono">
          {stops.length ? (
            stops.map((v, i) => (
              <li key={i}>
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                <span>{SONGS[TOWN_NODES[v].track as SongId].title}</span>
              </li>
            ))
          ) : (
            <li>
              <span className="empty">— no roads walked yet —</span>
            </li>
          )}
        </ul>
      </div>

      {st.left && (
        <div className="tend">
          <div className="ek mono">you left town by way of</div>
          <div className="en serif" style={{ color: ending?.c ?? '#7fa2b5' }}>
            {ending ? ending.n : '—'}
          </div>
          <div className="et serif">{ending ? `\u201c${ending.tag}\u201d` : 'the grind swallowed the exit. try another road.'}</div>
        </div>
      )}

      <div className="townctrl">
        <button className="btn" onClick={() => dispatch({ type: 'reset' })}>↺ re-enter the town</button>
        {st.left && (
          <Link className="btn primary" to="/">build the full record →</Link>
        )}
      </div>

      <div className="townlegend">
        <div className="leg"><span className="dot">●</span><span><b>The lantern</b> is you. Tap a lit place you can reach to walk there.</span></div>
        <div className="leg"><span className="dot">◍</span><span><b>The fog</b> lifts only around where you've been.</span></div>
        <div className="leg"><span className="dot">↗</span><span><b>The edge of town</b> opens once you've wandered enough — leaving is your ending.</span></div>
      </div>

      <p className="note mono">
        Placeholder places for now; in the finished town they'll be real locations with mood-carrying
        roads, and arriving plays the track. <Link to="/">← back to the EP</Link>
      </p>
    </div>
  )
}
