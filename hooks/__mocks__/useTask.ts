import {act} from "react-testing-library"

const {useTask} = jest.requireActual("../useTask")

function useMockTask(fn: () => any) {
  const task = useTask(fn)
  const cloneTask = {...task}

  cloneTask.run = (...args: any) => {
    let res: any
    // TODO: Lib | Use async act with React 16.9+
    act(() => {
      // TODO: Lib | Await for task.run when implementing async act
      res = task.run(...args)
    })

    return res
  }

  return cloneTask
}

module.exports = {
  useTask: useMockTask,
}
