import type { SongId } from './songs'
import { LETTER, FROM_LETTER } from './songs'

const NEEDED = 'TDLFWB'.split('').sort().join('')

/** raw 6-letter code, e.g. "TDLFWB" */
export function codeOf(order: SongId[]): string {
  return order.map((x) => LETTER[x]).join('')
}

/** display code, e.g. "DVN\u00b7TDLFWB" */
export function pretty(order: SongId[]): string {
  return 'DVN\u00b7' + codeOf(order)
}

/** full share link for a given base, e.g. https://breaking.davvn.com?cut=TDLFWB */
export function shareUrl(order: SongId[], base: string): string {
  return base + '?cut=' + codeOf(order)
}

/** parse any code string into a validated 6-track order, or null */
export function parseCode(str: string): SongId[] | null {
  const raw = (str || '')
    .toUpperCase()
    .replace(/DVN[\u00b7\-:.]?/, '')
    .replace(/[^TDLFWB]/g, '')
  if (raw.length !== 6 || raw.split('').sort().join('') !== NEEDED) return null
  return raw.split('').map((l) => FROM_LETTER[l])
}
