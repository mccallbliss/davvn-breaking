// The six tracks and their save-code letters.
// Two internal ids differ from their display titles (kept stable to avoid churn):
//   'outside'  -> displayed as "flatline"  (letter F)
//   'wanting'  -> displayed as "want"      (letter W)
export type SongId =
  | 'dissolve'
  | 'outside'
  | 'lifeless'
  | 'tryworst'
  | 'wanting'
  | 'blurry'

export type TrackId = Exclude<SongId, 'lifeless'>

export const SONGS: Record<SongId, { title: string }> = {
  dissolve: { title: 'dissolve' },
  outside: { title: 'flatline' },
  lifeless: { title: 'life less' },
  tryworst: { title: 'try your worst' },
  wanting: { title: 'want' },
  blurry: { title: 'blurry' },
}

export const LETTER: Record<SongId, string> = {
  dissolve: 'D',
  outside: 'F',
  lifeless: 'L',
  tryworst: 'T',
  wanting: 'W',
  blurry: 'B',
}

export const FROM_LETTER: Record<string, SongId> = Object.fromEntries(
  Object.entries(LETTER).map(([k, v]) => [v, k as SongId]),
) as Record<string, SongId>

export const OPENERS: SongId[] = ['dissolve', 'outside']

export const ALL_IDS = Object.keys(SONGS) as SongId[]
