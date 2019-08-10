const notify = jest.fn()
function useNotify() {
  return notify
}

module.exports = {
  useNotify,
}
