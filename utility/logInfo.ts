/**
 * Logs information to the console, preceding it with [INFO] notice.
 */
function logInfo(...args: any) {
  console.log("[INFO]", ...args)
}

export {logInfo}
