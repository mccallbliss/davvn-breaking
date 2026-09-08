import { Link } from 'react-router-dom'
import Explorer from '../features/Explorer'
import { FATES } from '../lib/archetypes'
import { useEpBuilder } from '../lib/useEpBuilder'

// Landing page: system bar + hero + the Explorer game + fates strip + footer.
export default function Home() {
  const builder = useEpBuilder()

  const scrollToGame = () =>
    document.getElementById('game')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const play = () => scrollToGame()
  const startGame = () => {
    builder.startWound()
    requestAnimationFrame(scrollToGame)
  }

  return (
    <>
      <div className="sysbar mono">
        <span className="wm">DAVVN</span>
        <span>the interactive EP</span>
        <span className="oct">▮ out october 2026</span>
        <a className="start" onClick={startGame}>▶ start</a>
      </div>

      <section className="hero">
        <div className="boot mono">memory card (8mb) · loading save data <span className="cur">▮</span></div>
        <h1 className="serif">
          Seven songs.
          <br />
          <em>You</em> decide the order.
        </h1>
        <p className="sub serif">
          A record about the version of yourself you can't stop grieving. Sequence it, and find out
          how it ends for you.
        </p>
        <a className="startbtn" onClick={startGame}>▶ Press Start</a>
        <span className="alt mono">
          the town and the dives are coming — <Link to="/town">preview the town</Link>
        </span>
      </section>

      <Explorer builder={builder} />

      <section className="fates">
        <div className="fh mono">— load game · the seven endings —</div>
        <div className="grid">
          {FATES.map((a) => (
            <a
              key={a.n}
              className="ftile"
              onClick={play}
              style={{ background: `linear-gradient(155deg, ${a.c}, #0a0f11)` }}
            >
              <div className="fk mono">{a.k}</div>
              <div className="fn serif">{a.n}</div>
              <div className="ft serif">&ldquo;{a.tag}&rdquo;</div>
            </a>
          ))}
          <a
            className="ftile"
            onClick={play}
            style={{
              border: '1px solid #3a1f20',
              background:
                'repeating-linear-gradient(90deg,#0d0709,#0d0709 3px,rgba(154,59,52,.08) 3px,rgba(154,59,52,.08) 4px),linear-gradient(155deg,#170d0f,#0a0607)',
            }}
          >
            <div className="fk mono">▚ corrupted ▞</div>
            <div className="fn serif" style={{ color: '#d98a84' }}>?????</div>
            <div className="ft serif">one more. good luck.</div>
          </a>
        </div>
      </section>

      <footer className="mono">
        <div className="fwm serif">davvn</div>
        <div>THE INTERACTIVE EP · OUT OCTOBER 2026</div>
        <div className="links">
          <a onClick={play}>play</a>
          <a href="#" data-social>instagram</a>
          <a href="#" data-social>tiktok</a>
          <a href="#" data-social>presave</a>
        </div>
        <div className="tomb serif">the antagonist was never the boyfriend. it was the binary.</div>
      </footer>
    </>
  )
}
