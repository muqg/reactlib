import {SyntheticEvent} from "react"

/**
 * Attempts to stop an event from reaching other components, preventing its
 * default action and propagation.
 */
export function stopEvent(event: SyntheticEvent | Event) {
  event.stopPropagation()
  event.preventDefault()
}
