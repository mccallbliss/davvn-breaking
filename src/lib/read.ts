import type { SongId } from './songs'

// "The read": two hidden axes the running order sums into, used to flavor the
// closing archetype into a variant. Tunable — leans + thresholds are the knobs.
//   a: reach (-) / let go (+)      b: look back (-) / push forward (+)
export interface Read {
  a: number
  b: number
}

const LEAN: Record<SongId, Read> = {
  dissolve: { a: -1.0, b: -1.0 },
  outside: { a: 0.6, b: -0.4 },
  tryworst: { a: 1.0, b: 0.8 },
  wanting: { a: -0.2, b: 1.0 },
  blurry: { a: 0.0, b: -0.3 },
  lifeless: { a: 0, b: 0 },
}

// weight by slot: wound, floor, first move (x2), mid, approach (x1.5), closer
const WEIGHT = [1, 0, 2, 1, 1.5, 1]

export function computeRead(order: SongId[]): Read {
  let a = 0
  let b = 0
  order.forEach((id, i) => {
    const w = WEIGHT[i] ?? 1
    a += w * LEAN[id].a
    b += w * LEAN[id].b
  })
  return { a, b }
}

// bar positions (0-100) for the two meters
export function readPos(r: Read): { a: number; b: number } {
  const clamp = (v: number) => Math.max(4, Math.min(96, 50 + v * 22))
  return { a: clamp(r.a), b: clamp(r.b) }
}

// a generic two-axis sentence
export function readLine(r: Read): string {
  const { a, b } = r
  let pa: string
  if (a <= -1.2) pa = 'reached for people at every turn'
  else if (a <= -0.3) pa = 'leaned toward connection'
  else if (a < 0.3) pa = "held people at arm's length and pulled them close in equal measure"
  else if (a < 1.2) pa = 'kept pulling inward'
  else pa = 'cut almost everyone loose'

  let pb: string
  if (b <= -0.8) pb = 'never stopped looking back'
  else if (b <= -0.2) pb = "kept one eye on what's behind you"
  else if (b < 0.4) pb = 'stood still between the past and the exit'
  else if (b < 1.3) pb = 'kept pushing toward what\u2019s next'
  else pb = 'never once looked back'

  return `You ${pa}, and you ${pb}.`
}

export interface Variant {
  sub: string
  coda: string
}

// keyed by the track you close on; the archetype's "spine" axis picks the variant
export function variantOf(order: SongId[]): Variant {
  const closer = order[order.length - 1]
  const { a, b } = computeRead(order)
  switch (closer) {
    case 'dissolve': // THE GHOST — spine: reach/let go
      if (a <= -0.6)
        return { sub: 'still reaching', coda: "You closed on the one who faded, and everything before it leaned toward them too. You're not haunted by a ghost — you're the one still leaving the porch light on." }
      if (a >= 0.7)
        return { sub: 'finally quiet', coda: 'You cut and burned your way here, and still it ends on the ghost. You let almost everyone go — except the one you never could.' }
      return { sub: 'keeping vigil', coda: 'You end where you began: watching a door that already closed. Not chasing, not letting go — just keeping the room exactly as they left it.' }
    case 'outside': // THE LOOP — spine: reach/let go
      if (a <= -0.2)
        return { sub: 'waiting to be woken', coda: "You kept reaching out from inside the fog, hoping someone would pull you awake. The loop isn't that nothing changes. It's that you keep waiting for it to." }
      if (a >= 0.9)
        return { sub: 'at home in the fog', coda: 'You stopped reaching and let the days blur. Somewhere in here the loop stopped feeling like a trap and started feeling like a place to live.' }
      return { sub: 'half-awake', coda: "You never fully chose the dream or the exit. You end where you drift — one foot in a life you'd rather have." }
    case 'tryworst': // THE BURN — spine: back/forward
      if (b >= 1.4)
        return { sub: 'already gone', coda: "You were leaving before the record even started. Every choice pointed at the door. By the time you closed it, you weren't behind it anymore." }
      if (b <= 0.4)
        return { sub: 'still relitigating', coda: "You closed on the clean break, but you kept looking back the whole way. The bridge is ash and you're still standing in the smoke, making the case." }
      return { sub: 'scorched even', coda: 'You burned it down without ceremony and didn\u2019t linger. No closure, no backward glance — just the door, and the quiet on the other side.' }
    case 'wanting': // THE ACHE — spine: back/forward
      if (b >= 1.6)
        return { sub: 'chasing the next', coda: 'You spent the whole record pushing toward it. Nothing you reach will be the thing — you already half-know that, and you reach anyway.' }
      if (b <= 0.4)
        return { sub: 'aching backward', coda: "You chase the next thing, but you kept looking over your shoulder. The want was never really forward — it's for the version of this that's already behind you." }
      return { sub: 'wanting either way', coda: "The ache doesn't care which way you face. You wanted what's gone and you wanted what's next, and you end still reaching for both." }
    case 'blurry': // THE OPEN QUESTION — spine: reach/let go
      if (a <= -0.3)
        return { sub: 'asking out loud', coda: "You kept reaching toward people the whole way to the not-knowing. The question isn't lonely — you're asking it with someone in the room." }
      if (a >= 0.6)
        return { sub: 'asking alone', coda: 'You pulled inward as you went, and you end asking the biggest question with no one to answer it. The fog is quieter alone. Not easier. Quieter.' }
      return { sub: 'just asking', coda: 'You refuse the clean answer and the clean exit both. You end in the fog on purpose — closing the question would cost more than living inside it.' }
    default:
      return { sub: '', coda: '' }
  }
}

export const GLITCH_VARIANT: Variant = {
  sub: 'corrupted data',
  coda: "You refused the binary so hard the save corrupted — both wounds stacked back to back, the grind never allowed to pull them apart. The read can't resolve. Something on the other side of the screen is doing the reading now.",
}
