import { Hotkey } from ".";

/**
 * Determines whether a keyboard event corresponds to a key being pressed.
 * @param key The key to be checked if pressed.
 * @param event The keyboard event.
 */
function isKeyPressed(key: Hotkey, event: KeyboardEvent | React.KeyboardEvent) {
    return (
        key.code === event.keyCode &&
        key.alt === event.altKey &&
        key.ctrl === event.ctrlKey &&
        key.meta === event.metaKey &&
        key.shift === event.shiftKey
    )
}

export { isKeyPressed }
