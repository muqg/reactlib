/**
 * Wrapper for window.sessionStorage in order to increase minification value
 * when using it a lot.
 */
export class Memory {
    /**
     * Adds a key to the storage or updates its value if it already exists.
     *
     * - Wrapper for sessionStorage.setItem()
     * @param key The name of the key to create/udapte.
     * @param value The value for the key.
     */
    static insert(key: string, value: string) {
        return sessionStorage.setItem(key, value)
    }

    /**
     * Attempts to return the stored value for the key.
     *
     * - Wrapper for sessionStorage.getItem()
     * @param key The name of the key to retrieve the value of.
     */
    static retrieve(key: string) {
        return sessionStorage.getItem(key)
    }
}
