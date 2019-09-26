/**
 * Waits for the provided amount of time.
 * @param time The time to wait in milliseconds.
 */
export function wait(time: number) {
  return new Promise<void>(resolve => setTimeout(resolve, time))
}
