import { isFunction } from "./assertions";

const sealed: Array<string | number> = []


/**
 * Allows a single execution for a key which is then sealed and any subsequent
 * calls are ignored.
 * @param key The seal key.
 * @param sealElement A callback to be executed if the key has not been called.
 * @returns Returns __True__ the first time a key is called; __False__ otherwise.
 */
function seal(key: string | number, sealElement: () => any): void
/**
 * Allows a single execution for a key which is then sealed and any subsequent
 * calls are ignored.
 * @param key The seal key.
 * @param sealElement A promise to be resolved if the key has not been called.
 * @returns Returns __True__ the first time a key is called; __False__ otherwise.
 */
function seal(key: string | number, sealElement: Promise<any>): void

function seal(key: string | number, sealElement: Promise<any> | (() => any)): void {
    if(sealed.includes(key)) {
        return
    }

    (async () => {
        sealed.push(key)

        let awaitable = sealElement
        if(isFunction(sealElement))
            awaitable = sealElement()
        await awaitable
    })()
}

export { seal };

