/* eslint-disable require-atomic-updates */
/**
 * A race condition is impossible to occur due to the fact that the function
 * cannot be called once it is already running.
 */

/**
 * Decorates a function, allowing it be called once and then
 * disregard any following calls until the first one returns.
 *
 * @param func The function to be locked.
 */
function lock<A extends any[], R>(
  func: (...args: A) => R,
): (...args: A) => Promise<R | void> {
  let locked = false

  return async (...args: A) => {
    if (!locked) {
      locked = true
      const res = await func(...args)
      locked = false

      return res
    }
  }
}

export {lock}
