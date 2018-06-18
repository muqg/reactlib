
/**
 * Allows to await until the __condition__ callback resolves to __True__.
 * @param condition The callback that will be awaited until __True__.
 */
async function until(condition: () => boolean): Promise<void>
/**
 * Allows to await until the __condition__ callback resolves to __True__.
 * @param condition The callback that will be awaited until __True__.
 * @param checkInterval The time between individual checks in milliseconds. The
 * default is 50ms with a minimum of 10ms between each check.
 */
async function until(condition: () => boolean, checkInterval: number): Promise<void>
/**
 * Allows to await until the __condition__ callback resolves to __True__.
 * @param condition The callback that will be awaited until __True__.
 * @param checkInterval The time between individual checks in milliseconds. The
 * default is 50ms with a minimum of 10ms between each check.
 * @param timeout The time to wait until failure in seconds. Default is 60s.
 */
async function until(condition: () => boolean, checkInterval: number, timeout: number): Promise<void>
async function until(condition: () => boolean, checkInterval = 50, timeout = 60): Promise<void> {
    checkInterval = Math.max(10, checkInterval)
    timeout = Math.max(0, timeout) * 1000 // Convert to milliseconds.

    return new Promise<void>((resolve, reject) => {
        let isRejected = false

        const check = () => {
            if(isRejected)
                return

            if(condition())
                resolve()
            else
                setTimeout(check, checkInterval)
        }

        setTimeout(() => {
            isRejected = true
            reject("Awaitable condition timed out.")
        }, timeout)

        check()
    })
}

export { until };

