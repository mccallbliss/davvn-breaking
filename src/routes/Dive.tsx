import { Link } from 'react-router-dom'

// STUB — the staged "dive" moments + video cutscenes land here (Tier 3).
export default function Dive() {
  return (
    <div className="stub">
      <div className="kick mono">tier 3 · rolling, per track</div>
      <h1 className="serif">The dive</h1>
      <p className="lede">
        The cinematic close-up for each track — a staged moment with a small yes/no beat, and where
        filmed cutscenes (as &lt;video&gt;) will live. Scaffolded and empty for now.
      </p>
      <Link className="btn" to="/">← back to the EP</Link>
    </div>
  )
}
