import type { SongId, TrackId } from './songs'
import { OPENERS } from './songs'

export interface Arch {
  k: string
  n: string
  tag: string
  c: string // accent color (Silent Hill x Twilight tuned)
  p: string
  trig: string
}

// keyed by the track you CLOSE on
export const ARCH: Record<TrackId, Arch> = {
  blurry: {
    k: 'Ending',
    n: 'THE OPEN QUESTION',
    tag: 'still deciding \u2014 and okay with it.',
    c: '#4f7183',
    p: "You'd rather sit in the not-knowing than force a clean answer. Endings make you suspicious; the fog feels more honest than the exit.",
    trig: 'blurry',
  },
  wanting: {
    k: 'Ending',
    n: 'THE ACHE',
    tag: 'the wanting was the whole point.',
    c: '#5f5170',
    p: 'You romanticize the reach far more than the grip. Nothing arrives quite like you pictured \u2014 and somewhere along the way you made peace with the ache instead of the answer.',
    trig: 'found wanting',
  },
  unravel: {
    k: 'Ending',
    n: 'THE TETHER',
    tag: 'it always comes back to a person.',
    c: '#7a4954',
    p: "Your compass points at someone else. Devotion or dependence \u2014 you can't always tell \u2014 but you lead with the heart and let your life tangle all the way in.",
    trig: 'unravel',
  },
  tryworst: {
    k: 'Ending',
    n: 'THE BURN',
    tag: 'no closure, just the door.',
    c: '#8a3b30',
    p: "You'd rather burn it clean than linger in the wreckage. Grudges become songs, exits become anthems, and the last word is always, always yours.",
    trig: 'try your worst',
  },
  dissolve: {
    k: 'Ending',
    n: 'THE GHOST',
    tag: 'haunted by who faded away.',
    c: '#4a6670',
    p: 'You keep glancing back at the people who slipped out of your life without a fight. Memory is the loudest room in the house, and you live in it.',
    trig: 'dissolve',
  },
  outside: {
    k: 'Ending',
    n: 'THE LOOP',
    tag: 'never fully woke up.',
    c: '#465561',
    p: "You live half inside the life you'd rather have. Dreamy, dissociative, romantic about the exit you keep almost taking but never do.",
    trig: 'outside (flatline)',
  },
}

export const GLITCH: Arch = {
  k: '\u258a corrupted data \u258e',
  n: 'THE GLITCH',
  tag: 'you broke the game.',
  c: '#2a1416',
  p: "You refused the binary so hard the save corrupted. You stacked both wounds back-to-back and wouldn't let the grind pull them apart. Now the signal breaks up \u2014 and something on the other side of the screen is looking back at you.",
  trig: 'a secret you won\u2019t be told',
}

export function isGlitch(order: SongId[]): boolean {
  return OPENERS.includes(order[2]) && order[6] === 'wanting'
}

export function archOf(order: SongId[]): Arch {
  return isGlitch(order) ? GLITCH : ARCH[order[6] as TrackId]
}

export const FATES: Arch[] = Object.values(ARCH)
