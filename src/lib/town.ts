import type { SongId } from './songs'

// The town as a node graph. Each place maps to a track (or null for home),
// positioned as %-coordinates inside the map box. Ported from the prototype,
// re-keyed to SongId so it shares titles + fates with the rest of the app.
export type NodeId =
  | 'home'
  | 'terminal'
  | 'strip'
  | 'rooftop'
  | 'allnight'
  | 'roundabout'
  | 'overpass'

export interface TownNode {
  name: string
  track: SongId | null
  x: number
  y: number
}

export const TOWN_NODES: Record<NodeId, TownNode> = {
  home: { name: 'home', track: null, x: 50, y: 66 },
  terminal: { name: 'the dark apartment', track: 'dissolve', x: 24, y: 72 },
  strip: { name: 'the strip', track: 'lifeless', x: 52, y: 48 },
  rooftop: { name: 'the rooftop', track: 'tryworst', x: 33, y: 30 },
  allnight: { name: 'the all-night', track: 'wanting', x: 68, y: 26 },
  roundabout: { name: 'the roundabout', track: 'blurry', x: 82, y: 44 },
  overpass: { name: 'the overpass', track: 'outside', x: 50, y: 12 },
}

export const TOWN_EDGES: [NodeId, NodeId][] = [
  ['home', 'strip'],
  ['home', 'terminal'],
  ['terminal', 'strip'],
  ['terminal', 'rooftop'],
  ['strip', 'rooftop'],
  ['strip', 'allnight'],
  ['strip', 'roundabout'],
  ['rooftop', 'allnight'],
  ['allnight', 'overpass'],
  ['roundabout', 'overpass'],
]

// track-places you must walk before the way out appears
export const THRESHOLD = 5

// atmosphere line shown when you arrive somewhere
export const STATUS: Record<SongId, string> = {
  dissolve: 'a dark window you used to know the light of.',
  lifeless: 'the strip. everyone you know is grinding here.',
  tryworst: 'the rooftop. someone climbed over you to get up here.',
  wanting: 'the all-night. nothing on the shelves is ever enough.',
  blurry: 'the roundabout. every exit looks the same in the fog.',
  outside: 'the overpass. the edge of everything.',
}

export function neighbors(id: NodeId): NodeId[] {
  const out: NodeId[] = []
  for (const [a, b] of TOWN_EDGES) {
    if (a === id) out.push(b)
    if (b === id) out.push(a)
  }
  return out
}
