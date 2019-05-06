import {useEffect, useRef} from "react"

/**
 * Sets up an interval that executes the most recently supplied callback.
 * The interval may be paused and its delay can be dynamically adjusted.
 *
 * @param callback A callback to be passed to the interval.
 * @param delay Interval delay in milliseconds or null to stop/pause the interval.
 */
function useInterval(callback: () => any, delay: number | null) {
  const savedCallback = useRef(callback)

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }

    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export {useInterval}
