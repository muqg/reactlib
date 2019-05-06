/**
 * Decorates a function, allowing it to delay its execution,
 * while debouncing any following calls in the meantime.
 *
 * @param func The function to be delayed.
 *
 * @param wait Delay time in milliseconds.
 */
function delay<A extends any[]>(
  func: (...args: A) => Promise<void> | void,
  wait = 250,
) {
  let timeout: number | undefined

  return (...args: A) => {
    clearTimeout(timeout)
    timeout = setTimeout(func, wait, ...args)
  }
}

export {delay}
