// Always run Jest in production mode.
global.__DEV__ = false
process.env.NODE_ENV = "production"

if (typeof document !== undefined) {
  document.execCommand = () => {}
}

if (typeof window !== undefined) {
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
