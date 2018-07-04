import { isFunction } from "./assertions";
import { UDict } from "./type";

const locked: UDict<boolean> = {}


/**
 * Locks a key, disallowing (ignoring) any duplicate calls to it until the first
 * locked element for this key is resolved.
 * @param key The lock key.
 * @param lockElement A callable to be locked.
 */
function lock(key: string | number, lockElement: () => any): void
/**
 * Locks a key, disallowing (ignoring) any duplicate calls to it until the first
 * locked element for this key is resolved.
 * @param key The lock key.
 * @param lockElement A Promise to be locked.
 */
function lock(key: string | number, lockElement: Promise<any>): void

function lock(key: string | number, lockElement: Promise<void> | (() => Promise<any>)): void {
    (async () => {
        if(locked[key])
            return
        try {
            locked[key] = true
            let awaitable = lockElement
            if(isFunction(lockElement))
                awaitable = lockElement()
            await awaitable
        }
        finally {
            locked[key] = false
        }
    })()
}

export { lock };

