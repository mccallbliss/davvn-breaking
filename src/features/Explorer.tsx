import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { SongId } from '../lib/songs'
import { SONGS } from '../lib/songs'
import { FRAME, WOUNDS } from '../lib/frames'
import { FATES } from '../lib/archetypes'
import { parseCode, shareUrl, codeOf } from '../lib/cutcode'
import { BASE_URL } from '../lib/config'
import type { EpBuilder } from '../lib/useEpBuilder'
import Shell from '../components/Shell'
import MemoryCard from '../components/MemoryCard'
import SaveFile from '../components/SaveFile'
import ShareCard from '../components/ShareCard'

const GLYPHS = ['✕', '○', '△', '□', '◇', '◦']

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

  const scrollToGame = () =>
    document.getElementById('game')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const startWound = () => {
    b.startWound()
    scrollToGame()
  }

  return (
    <div id="game" className="gamewrap">
      <Shell>
        {b.phase === 'intro' && (
          <>
            <div className="kick mono">choose your own adventure · interactive EP</div>
            <h1 className="serif">Which davvn are you?</h1>
            <p className="lede">
              Seven songs, one EP — but <b>you</b> sequence the order they hit in, one decision at a
              time. Where you choose to end reveals your ending. Build it, keep the save, share your
              cut.
            </p>
            <div className="btnrow">
              <button className="btn primary" onClick={startWound}>▶ New game</button>
              <button className="btn" onClick={() => b.goto('gallery')}>Load game</button>
              <button className="btn" onClick={() => b.goto('decode')}>Enter save code</button>
            </div>
          </>
        )}

        {b.phase === 'wound' && (
          <>
            <div className="prog mono">block 01 / 07 · the wound</div>
            <h1 className="serif">What breaks you first?</h1>
            <div className="menu">
              {(Object.keys(WOUNDS) as Array<'dissolve' | 'outside'>).map((id, i) => (
                <button key={id} className="mi" onClick={() => b.pickWound(id)}>
                  <span className="btn-glyph">{GLYPHS[i]}</span>
                  <span>
                    <span className="klow">{WOUNDS[id].kicker}</span>
                    <div className="mt">{WOUNDS[id].lab}</div>
                    <div className="ms">{WOUNDS[id].sub}</div>
                    <div className="mp">writes <b>{SONGS[id].title}</b></div>
                  </span>
                </button>
              ))}
            </div>
            <MemoryCard order={b.order} />
            <div className="hints mono">
              <span><b>✕</b> select</span>
              <span><b>○</b> <a className="lk" onClick={() => b.goto('intro')}>back</a></span>
            </div>
          </>
        )}

        {b.phase === 'build' && (
          <>
            <div className="prog mono">
              block {String(b.order.length + 1).padStart(2, '0')} / 07 · what happens next?
            </div>
            {b.order.length === 2 && (
              <p className="lede">
                <b>life less</b> locks in as track 2 — the grind under both wounds. No one skips it.
                Now sequence what's left.
              </p>
            )}
            <div className="menu">
              {b.pool.map((id, i) => (
                <button key={id} className="mi" onClick={() => b.pick(id)}>
                  <span className="btn-glyph">{GLYPHS[i] || '◦'}</span>
                  <span>
                    <div className="mt">{FRAME[id as keyof typeof FRAME].lab}</div>
                    <div className="ms">{FRAME[id as keyof typeof FRAME].sub}</div>
                    <div className="mp">writes <b>{SONGS[id].title}</b></div>
                  </span>
                </button>
              ))}
            </div>
            <MemoryCard order={b.order} />
            <div className="hints mono">
              <span><b>✕</b> select</span>
              <span><b>△</b> <a className="lk" onClick={b.undo}>step back</a></span>
              <span><b>○</b> <a className="lk" onClick={startWound}>restart</a></span>
            </div>
          </>
        )}

        {b.phase === 'done' && (
          <>
            <SaveFile
              order={b.order}
              shareLink={shareUrl(b.order, BASE_URL)}
              onExport={() => setCardOpen(true)}
            />
            <div className="btnrow">
              <button className="btn" onClick={() => b.goto('gallery')}>Load game</button>
              <button className="btn" onClick={b.undo}>△ Step back</button>
              <button className="btn" onClick={startWound}>▶ New game</button>
            </div>
          </>
        )}

        {b.phase === 'gallery' && (
          <>
            <div className="kick mono">load game</div>
            <h1 className="serif">Every way the record can end</h1>
            <p className="lede">
              Six endings, set by the track you close on. A seventh only surfaces if you stop playing
              by the rules — and it doesn't save clean.
            </p>
            <div className="slots">
              {FATES.map((a) => (
                <div key={a.n} className="slot" onClick={startWound}>
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
              <div className="slot corr" onClick={startWound}>
                <div className="sth">▚</div>
                <div>
                  <div className="sn serif">?????</div>
                  <div className="st serif">corrupted data</div>
                  <div className="se mono">recovery: <b>unknown</b></div>
                </div>
              </div>
            </div>
            <div className="btnrow">
              <button className="btn primary" onClick={startWound}>▶ New game</button>
              <button className="btn" onClick={() => b.goto('intro')}>← home</button>
            </div>
          </>
        )}

        {b.phase === 'decode' && (
          <Decode onLoad={(o) => b.loadOrder(o)} onHome={() => b.goto('intro')} />
        )}
      </Shell>

      {cardOpen && b.phase === 'done' && (
        <ShareCard order={b.order} onClose={() => setCardOpen(false)} />
      )}
    </div>
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
    <>
      <div className="kick mono">load save code</div>
      <h1 className="serif">Load someone else's save</h1>
      <p className="lede">
        Enter a davvn save code (like <b>DVN·DLTUWOB</b>) to play their exact running order and see
        the ending it reaches.
      </p>
      <input
        className="codein mono"
        value={val}
        maxLength={16}
        placeholder="DVN·________"
        onChange={(e) => setVal(e.target.value)}
      />
      <div className="btnrow">
        <button className="btn primary" onClick={submit}>▶ Load</button>
        <button className="btn" onClick={onHome}>← home</button>
      </div>
      {err && (
        <p className="lede" style={{ color: '#d98a84', marginTop: 12 }}>
          {err}
        </p>
      )}
    </>
  )
}
