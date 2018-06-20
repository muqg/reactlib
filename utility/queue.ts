import { isFunction } from "./assertions";
import { StringDict } from "./interfaces";

const queued: StringDict<Array<QueueElement> | undefined> = {}

type QueueElement = Promise<any> | (() => Promise<any>)


/**
 * Creates an async execution queue that executes elements in order one after
 * another (first in, first out).
 * @param key Key to the queue.
 * @param elements Elements to be added to the queue.
 */
function queue(key: string | number, ...elements: (() => Promise<any>)[]): void
/**
 * Creates an async execution queue that executes elements in order one after
 * another (first in, first out).
 * @param key Key to the queue.
 * @param element The element to be added to the queue.
 */
function queue(key: string | number, ...elements: Promise<any>[]): void

function queue(key: string | number, ...elements: QueueElement[]): void {
    const targetQueue = queued[key]
    if(!targetQueue) {
        queued[key] = [...elements];

        (async () => {
            const executionQueue = queued[key]
            if(!executionQueue)
                return

            while(true) {
                let current = executionQueue.shift()
                if(!current)
                    break

                if(isFunction(current))
                    current = current()
                await current
            }

            // Queues that are done executing are 'undefined' in order to
            // signify that a new execution queue should be initiated instead
            // of appending to the existing one.
            queued[key] = undefined
        })()
    }
    else {
        targetQueue.push(...elements)
    }
}

export { queue };

