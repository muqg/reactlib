/**
 * This must be called before using any part of this library. Otherwise some
 * parts of it will not work properly.
 */
export function initializeReactLibrary() {
    try {
        // Attempt to call possibly undefined dev flag.
        __DEV__;
    }
    catch {
        let value: boolean | undefined = undefined
        try {
            value = process.env.NODE_ENV === "development"
        }
        catch {
            // No need to take any action. This only prevents a crash when process
            // is undefined or does not have the expected object structure.
        }

        // @ts-ignore Undefined global dev flag.
        window.__DEV__ = value
    }
}
