import { useCallback, useState } from 'react'
import type { SongId } from './songs'
import { ALL_IDS } from './songs'

export type Phase = 'intro' | 'wound' | 'build' | 'done' | 'gallery' | 'decode'

interface Snapshot {
  order: SongId[]
  pool: SongId[]
}

export interface EpBuilder {
  order: SongId[]
  pool: SongId[]
  phase: Phase
  startWound: () => void
  pickWound: (id: SongId) => void
  pick: (id: SongId) => void
  undo: () => void
  reset: () => void
  loadOrder: (o: SongId[]) => void
  goto: (p: Phase) => void
}

export function useEpBuilder(): EpBuilder {
  const [order, setOrder] = useState<SongId[]>([])
  const [pool, setPool] = useState<SongId[]>([])
  const [phase, setPhase] = useState<Phase>('intro')
  const [history, setHistory] = useState<Snapshot[]>([])

  const reset = useCallback(() => {
    setOrder([])
    setPool([])
    setHistory([])
    setPhase('intro')
  }, [])

  const startWound = useCallback(() => {
    setOrder([])
    setPool([])
    setHistory([])
    setPhase('wound')
  }, [])

  const pickWound = useCallback(
    (id: SongId) => {
      setHistory((h) => [...h, { order, pool }])
      const next: SongId[] = [id, 'lifeless']
      const nextPool = ALL_IDS.filter((x) => x !== id && x !== 'lifeless')
      setOrder(next)
      setPool(nextPool)
      setPhase('build')
    },
    [order, pool],
  )

  const pick = useCallback(
    (id: SongId) => {
      setHistory((h) => [...h, { order, pool }])
      const next = [...order, id]
      const nextPool = pool.filter((x) => x !== id)
      if (nextPool.length === 1) {
        next.push(nextPool[0])
        setOrder(next)
        setPool([])
        setPhase('done')
      } else {
        setOrder(next)
        setPool(nextPool)
      }
    },
    [order, pool],
  )

  const undo = useCallback(() => {
    setHistory((h) => {
      if (!h.length) return h
      const last = h[h.length - 1]
      setOrder(last.order)
      setPool(last.pool)
      setPhase(
        last.order.length === 0 ? 'wound' : last.pool.length >= 2 ? 'build' : 'done',
      )
      return h.slice(0, -1)
    })
  }, [])

  const loadOrder = useCallback((o: SongId[]) => {
    setOrder(o)
    setPool([])
    setHistory([])
    setPhase('done')
  }, [])

  const goto = useCallback((p: Phase) => setPhase(p), [])

  return { order, pool, phase, startWound, pickWound, pick, undo, reset, loadOrder, goto }
}
