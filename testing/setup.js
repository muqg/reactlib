// Always run Jest in production mode.
global.__DEV__ = false
process.env.NODE_ENV = "production"

if (typeof document !== "undefined") {
  global.document.execCommand = () => {}

  // Fixes some material-ui testing issues where document.createRange is
  // undefined. For more information:
  // https://github.com/mui-org/material-ui/issues/15726#issuecomment-493124813
  global.document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
      nodeName: "BODY",
      ownerDocument: document,
    },
  })
}

if (typeof window !== "undefined") {
  global.requestAnimationFrame = callback => {
    setTimeout(callback)
  }

  global.requestIdleCallback = callback => {
    return setTimeout(() => {
      callback({
        timeRemaining() {
          return Infinity
        },
      })
    })
  }

  global.cancelIdleCallback = id => {
    clearTimeout(id)
  }
}
