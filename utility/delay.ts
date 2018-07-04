import { UDict } from "./type";

const delayed: UDict<Delayed> = {}

interface Delayed {
    timer: number
    delay: number
    callback: () => any
}

/**
 * Delays execution so that this function can be called multiple times before it
 * times out and then executes the last callback this function was provided with.
 * @param key The key to the delayed callback.
 * @param time The time to delay execution in milliseconds.
 * @param callback The callback to be delayed.
 */
function delay(key: string | number, time: number, callback: () => any): void
/**
 * Delays execution so that this function can be called multiple times before it
 * times out and then executes the last callback this function was provided with.
 * @param key The key to the delayed callback.
 * @param time The time to delay execution in milliseconds.
 * @param callback The callback to be delayed.
 * @param reset Whether to restart the timeout countdown on each call.
 */
function delay(key: string | number, time: number, callback: () => any): void

function delay(key: string | number, time: number, callback: () => any, reset = true): void {
    const existingElement = delayed[key]

    let timer = -1
    if(existingElement) {
        timer = existingElement.timer

        if(reset)
            clearTimeout(existingElement.timer)
    }

    if(!existingElement || reset) {
        const timeoutCallback = () => {
            const target = delayed[key]
            if(target)
                target.callback()

            delayed[key] = undefined
        }

        // As 'any' in order to return a number.
        timer = setTimeout(timeoutCallback as any, time)
    }

    delayed[key] = {
        delay: time,
        timer: timer,
        callback: callback
    }
}

export { delay };

