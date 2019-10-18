import {useLayoutEffect, useRef} from "react"

/**
 * Returns a boolean indicating whether it is the initial render
 * of the component.
 */
export function useInitialRender() {
  const initial = useRef(true)

  useLayoutEffect(() => {
    initial.current = false
  }, [])

  return initial.current
}
