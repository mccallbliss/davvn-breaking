import Explorer from '../features/Explorer'
import { useEpBuilder } from '../lib/useEpBuilder'

// Immersive full-bleed landing: the Explorer fills the viewport over the
// global Atmosphere backdrop. Intro, choices, and result are all one screen deep.
export default function Home() {
  const builder = useEpBuilder()
  return <Explorer builder={builder} />
}
