import { StringDict } from "./interfaces";
import { isFunction } from "./assertions";

const locked: StringDict<boolean | undefined> = {}

/**
 * Locks a key, disallowing (ignoring) any duplicate calls to it until the first
 * locked element for this key is resolved.
 *  - Awaiting this function may break the lock, therefore any exception handling
 *    should be performed inside the lock.
 * @param key The lock key.
 * @param lockedElement A Promise to be locked.
 */
async function lock(key: string | number, lockedElement: Promise<void>): Promise<void>
/**
* Locks a key, disallowing (ignoring) any duplicate calls to it until the first
 * locked element for this key is resolved.
 *  - Awaiting this function may break the lock, therefore any exception handling
 *    should be performed inside the lock.
 * @param key The lock key.
 * @param lockedElement A callable to be locked.
 */
async function lock(key: string | number, lockedElement: () => Promise<any>): Promise<void>

async function lock(key: string | number, lockedElement: Promise<void> | (() => Promise<any>)): Promise<void> {
    if(locked[key])
        return
    try {
        locked[key] = true
        let awaitable = lockedElement
        if(isFunction(lockedElement))
            awaitable = lockedElement()
        await awaitable
    }
    finally {
        locked[key] = false
    }
}

export { lock };
