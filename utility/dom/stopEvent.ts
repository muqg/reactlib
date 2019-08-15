/**
 * Attempts to stop an event from reaching other components, preventing its
 * default action and propagation.
 */
export function stopEvent(event: React.SyntheticEvent | Event) {
  event.stopPropagation()
  event.preventDefault()
}
