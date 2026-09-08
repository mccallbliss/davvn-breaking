import type { SongId, TrackId } from './songs'

// "what happens next" framing for each choosable track
export const FRAME: Record<TrackId, { lab: string; sub: string }> = {
  dissolve: {
    lab: 'Look back at the friend who faded out',
    sub: "the face you'd half-forgotten, back on your screen",
  },
  outside: {
    lab: 'Sink into the fog of another identical day',
    sub: "wishing this life were a dream you'd wake from",
  },
  tryworst: {
    lab: 'Cut off the friend feeding your doubt',
    sub: "call out who's been climbing on your back",
  },
  wanting: {
    lab: "Chase the next thing, sure it'll be enough",
    sub: 'the wanting always outruns the having',
  },
  blurry: {
    lab: 'Question if you\u2019re headed anywhere right',
    sub: 'is it already too late to start over?',
  },
}

// the opening wound (track 1)
export const WOUNDS: Record<'dissolve' | 'outside', { kicker: string; lab: string; sub: string }> = {
  dissolve: {
    kicker: 'save point \u00b7 external',
    lab: 'A face you\u2019d forgotten surfaces on your screen',
    sub: 'Someone you used to know, whole life moved on without you. Comparison is the first cut.',
  },
  outside: {
    kicker: 'save point \u00b7 internal',
    lab: 'You wake to another day exactly like the last',
    sub: 'You just want to wake up from your own life. Stagnation is the first cut.',
  },
}

// a line about the first real move (order[2])
export const FIRST_NOTE: Record<TrackId, string> = {
  dissolve: 'You turned back toward the lost friend before anything else.',
  outside: 'You let yourself sink into the fog before facing anything.',
  tryworst: 'You led with a clean break \u2014 anger before grief.',
  wanting: 'You led with hunger \u2014 already onto the next thing.',
  blurry: 'You led with doubt \u2014 questioning before feeling.',
}

export function firstNote(id: SongId): string {
  return FIRST_NOTE[id as TrackId] ?? 'You move deeper into the fog.'
}
