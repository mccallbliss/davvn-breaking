import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { SongId } from '../lib/songs'
import { SONGS } from '../lib/songs'
import { FRAME, WOUNDS } from '../lib/frames'
import { FATES } from '../lib/archetypes'
import { parseCode, shareUrl, codeOf } from '../lib/cutcode'
import { BASE_URL } from '../lib/config'
import type { EpBuilder } from '../lib/useEpBuilder'
import MemoryCard from '../components/MemoryCard'
import SaveFile from '../components/SaveFile'
import ShareCard from '../components/ShareCard'

const GLYPHS = ['\u2715', '\u25cb', '\u25b3', '\u25a1', '\u25c7', '\u25e6']

export default function Explorer({ builder }: { builder: EpBuilder }) {
  const b = builder
  const [params, setParams] = useSearchParams()
  const [cardOpen, setCardOpen] = useState(false)

  // deep-link: ?cut= loads a shared save on mount
  useEffect(() => {
    const cut = params.get('cut')
    if (cut) {
      const o = parseCode(cut)
      if (o) b.loadOrder(o)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // keep ?cut= in sync with a finished order
  useEffect(() => {
    if (b.phase === 'done') {
      const p = new URLSearchParams(params)
      p.set('cut', codeOf(b.order))
      setParams(p, { replace: true })
    } else if (params.get('cut')) {
      const p = new URLSearchParams(params)
      p.delete('cut')
      setParams(p, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [b.phase, b.order])

  // each phase is its own full-viewport screen — start at the top on change
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [b.phase])

  return (
    <>
      {b.phase === 'intro' && (
        <div className="screen">
          <div className="readout">
            memory card (8mb) {'\u00b7'} loading save data <span className="blink">{'\u2588'}</span>
          </div>
          <div className="intro-body">
            <div className="wordmark">davvn</div>
            <div className="kicker">a record you have to walk through to hear.</div>
            <nav className="menu">
              <button className="mi" onClick={b.startWound}>New game</button>
              <button className="mi" onClick={() => b.goto('gallery')}>Load game</button>
              <button className="mi" onClick={() => b.goto('decode')}>Enter save code</button>
            </nav>
          </div>
          <div className="prompt">
            <span><b>{'\u2715'}</b> select</span>
            <span className="spacer">out october 2026</span>
          </div>
        </div>
      )}

      {b.phase === 'wound' && (
        <div className="screen">
          <div className="readout">block 01 / 06 {'\u00b7'} the wound</div>
          <div className="wq">What breaks you first?</div>
          <div className="choices">
            {(Object.keys(WOUNDS) as Array<'dissolve' | 'outside'>).map((id, i) => (
              <button key={id} className="choice" onClick={() => b.pickWound(id)}>
                <span className="k">{i === 0 ? '\u2715' : '\u25cb'}</span>
                <span className="ch-lab">
                  <span className="ch-eyebrow">{WOUNDS[id].kicker}</span>
                  {WOUNDS[id].lab}
                  <span className="ch-sub">
                    {WOUNDS[id].sub} {'\u00b7'} writes &ldquo;{SONGS[id].title}&rdquo;
                  </span>
                </span>
              </button>
            ))}
          </div>
          <div className="prompt">
            <span><b>{'\u25cb'}</b> <a onClick={() => b.goto('intro')}>back</a></span>
          </div>
        </div>
      )}

      {b.phase === 'build' && (
        <div className="screen">
          <div className="readout">
            block {String(b.order.length + 1).padStart(2, '0')} / 06 {'\u00b7'} what happens next?
          </div>
          {b.order.length === 2 && (
            <p className="note">
              <b>life less</b> locks in as track 2 — the grind under both wounds. No one skips it.
              Now sequence what's left.
            </p>
          )}
          <div className="choices">
            {b.pool.map((id, i) => (
              <button key={id} className="choice" onClick={() => b.pick(id)}>
                <span className="k">{GLYPHS[i] || '\u25e6'}</span>
                <span className="ch-lab">
                  {FRAME[id as keyof typeof FRAME].lab}
                  <span className="ch-sub">
                    {FRAME[id as keyof typeof FRAME].sub} {'\u00b7'} writes &ldquo;{SONGS[id].title}&rdquo;
                  </span>
                </span>
              </button>
            ))}
          </div>
          <MemoryCard order={b.order} />
          <div className="prompt">
            <span><b>{'\u25b3'}</b> <a onClick={b.undo}>step back</a></span>
            <span><b>{'\u25cb'}</b> <a onClick={b.startWound}>restart</a></span>
          </div>
        </div>
      )}

      {b.phase === 'done' && (
        <div className="screen">
          <SaveFile
            order={b.order}
            shareLink={shareUrl(b.order, BASE_URL)}
            onExport={() => setCardOpen(true)}
          />
          <div className="prompt">
            <span><b>{'\u25b3'}</b> <a onClick={b.undo}>step back</a></span>
            <span><a onClick={() => b.goto('gallery')}>load game</a></span>
            <span className="spacer"><a onClick={b.startWound}>{'\u25b6'} new game</a></span>
          </div>
        </div>
      )}

      {b.phase === 'gallery' && (
        <div className="screen">
          <div className="kick">load game</div>
          <h1 className="serif">Every way the record can end</h1>
          <p className="lede">
            Five endings, set by the track you close on. A sixth only surfaces if you stop playing
            by the rules — and it doesn't save clean.
          </p>
          <div className="slots">
            {FATES.map((a) => (
              <div key={a.n} className="slot" onClick={b.startWound}>
                <div className="sth" style={{ background: `linear-gradient(155deg, ${a.c}, #0b1114)` }}>
                  {a.n[4] || a.n[0]}
                </div>
                <div>
                  <div className="sn serif">{a.n}</div>
                  <div className="st serif">&ldquo;{a.tag}&rdquo;</div>
                  <div className="se mono">ends on <b>{a.trig}</b></div>
                </div>
              </div>
            ))}
            <div className="slot corr" onClick={b.startWound}>
              <div className="sth">{'\u258a'}</div>
              <div>
                <div className="sn serif">?????</div>
                <div className="st serif">corrupted data</div>
                <div className="se mono">recovery: <b>unknown</b></div>
              </div>
            </div>
          </div>
          <div className="prompt">
            <span><b>{'\u2715'}</b> <a onClick={b.startWound}>new game</a></span>
            <span><a onClick={() => b.goto('intro')}>{'\u2190'} home</a></span>
          </div>
        </div>
      )}

      {b.phase === 'decode' && (
        <Decode onLoad={(o) => b.loadOrder(o)} onHome={() => b.goto('intro')} />
      )}

      {cardOpen && b.phase === 'done' && (
        <ShareCard order={b.order} onClose={() => setCardOpen(false)} />
      )}
    </>
  )
}

function Decode({ onLoad, onHome }: { onLoad: (o: SongId[]) => void; onHome: () => void }) {
  const [val, setVal] = useState('')
  const [err, setErr] = useState('')
  const submit = () => {
    const o = parseCode(val)
    if (!o) {
      setErr("Corrupted code — a save needs all 7 tracks, each once.")
      return
    }
    onLoad(o)
  }
  return (
    <div className="screen">
      <div className="kick">load save code</div>
      <h1 className="serif">Load someone else's save</h1>
      <p className="lede">
        Enter a davvn save code (like <b>DVN{'\u00b7'}TDLFWB</b>) to play their exact running order
        and see the ending it reaches.
      </p>
      <input
        className="codein mono"
        value={val}
        maxLength={16}
        placeholder={'DVN\u00b7______'}
        onChange={(e) => setVal(e.target.value)}
      />
      <div className="prompt">
        <span><b>{'\u2715'}</b> <a onClick={submit}>load</a></span>
        <span><a onClick={onHome}>{'\u2190'} home</a></span>
      </div>
      {err && <p className="lede" style={{ color: '#d98a84', marginTop: 12 }}>{err}</p>}
    </div>
  )
}
