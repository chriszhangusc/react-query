import React from 'react'

import { uid, isServer } from '../core/utils'

export function useUid(): number {
  const ref = React.useRef(0)

  if (ref.current === null) {
    ref.current = uid()
  }

  return ref.current
}

export function useGetLatest<T>(obj: T): () => T {
  const ref = React.useRef<T>(obj)
  ref.current = obj
  return React.useCallback(() => ref.current, [])
}

export function useMountedCallback<T extends Function>(callback: T): T {
  const mounted = React.useRef(false)

  React[isServer ? 'useEffect' : 'useLayoutEffect'](() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  return (React.useCallback(
    (...args: any[]) => (mounted.current ? callback(...args) : void 0),
    [callback]
  ) as any) as T
}

export function useRerenderer() {
  const rerender = useMountedCallback(React.useState<unknown>()[1])
  return React.useCallback(() => rerender({}), [rerender])
}
