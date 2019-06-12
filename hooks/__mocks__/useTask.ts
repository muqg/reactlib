const {useTask} = jest.requireActual("../useTask")

// TODO: Lib | Consider better useTask mock implementation
// Mocking useTask should make it run synchronously with no Promises involved.
module.exports = {
  useTask: (fn: (...args: any) => any) => {
    return {
      ...useTask(fn),
      run: (...args: any) => {
        let task = fn(...args)

        if (task instanceof Promise) {
          throw "Mocked Task hook received a Promise as its callback result. " +
            "Please mock its callback to run synchronously as well."
        }

        if (
          typeof task[Symbol.iterator] === "function" ||
          typeof task[Symbol.asyncIterator] === "function"
        ) {
          task = task as IterableIterator<any>
          while (true) {
            const {done, value} = task.next()
            if (done) {
              return done ? value : null
            }
          }
        }

        return task
      },
    }
  },
}
