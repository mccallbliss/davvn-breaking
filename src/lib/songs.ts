// The seven tracks and their save-code letters.
// Framework-agnostic — pure data, portable anywhere.

export type SongId =
  | 'dissolve'
  | 'outside'
  | 'lifeless'
  | 'unravel'
  | 'tryworst'
  | 'wanting'
  | 'blurry'

export type TrackId = Exclude<SongId, 'lifeless'>

export const SONGS: Record<SongId, { title: string }> = {
  dissolve: { title: 'dissolve' },
  outside: { title: 'outside (flatline)' },
  lifeless: { title: 'life less' },
  unravel: { title: 'unravel' },
  tryworst: { title: 'try your worst' },
  wanting: { title: 'found wanting' },
  blurry: { title: 'blurry' },
}

export const LETTER: Record<SongId, string> = {
  dissolve: 'D',
  outside: 'O',
  lifeless: 'L',
  unravel: 'U',
  tryworst: 'T',
  wanting: 'W',
  blurry: 'B',
}

export const FROM_LETTER: Record<string, SongId> = Object.fromEntries(
  Object.entries(LETTER).map(([k, v]) => [v, k as SongId]),
) as Record<string, SongId>

export const OPENERS: SongId[] = ['dissolve', 'outside']

export const ALL_IDS = Object.keys(SONGS) as SongId[]
