// @ts-ignore TS1208: All files must be modules when the '--isolatedModules' flag is provided.
const notify = jest.fn()
function useNotify() {
  return notify
}

module.exports = {
  useNotify,
}
