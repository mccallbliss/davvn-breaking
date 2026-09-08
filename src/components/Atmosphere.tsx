// Fixed full-screen treatment layers. Same recipe as the LUT/CSS mock:
// fog + grain + vignette. Sits behind all content (z-index in index.css).
export default function Atmosphere() {
  return (
    <>
      <div className="fog" />
      <div className="grain" />
      <div className="vig" />
    </>
  )
}
