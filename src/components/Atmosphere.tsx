import { FOG_FOREST } from '../lib/fogforest'

// Full-bleed immersive backdrop: the fog-forest photo (embedded), a drifting fog
// layer, and a legibility scrim below content — plus the CRT treatment
// (scanlines, glow, vignette, flicker) layered above everything.
export default function Atmosphere() {
  return (
    <>
      <div className="bg" aria-hidden="true">
        <div className="bg-photo" style={{ backgroundImage: `url(${FOG_FOREST})` }} />
        <div className="bg-fog" />
        <div className="bg-scrim" />
      </div>
      <div className="crt" aria-hidden="true">
        <div className="crt-scan" />
        <div className="crt-glow" />
        <div className="crt-vig" />
        <div className="crt-flick" />
      </div>
    </>
  )
}
