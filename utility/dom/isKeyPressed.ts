import { Hotkey } from ".";
import { isObject, isType } from "../assertions";

/**
 * Determines whether a keyboard event corresponds to a key being pressed.
 * Keypress when user is typing input is always False.
 * @param key The key to be checked if pressed.
 * @param event The keyboard event.
 */
function isKeyPressed(key: Hotkey, event: KeyboardEvent | React.KeyboardEvent): boolean {
    const target = event.target
    if(isObject(target, Element)) {
        const nodeName = target.nodeName.toLowerCase()
        if(nodeName === "input" || nodeName === "textarea" || target.hasAttribute("contenteditable"))
            return false
    }

    if(isType<React.KeyboardEvent>(event, e => e.nativeEvent))
        event = event.nativeEvent

    return (
        (
            key.code && key.code === event.code ||
            key.key && key.key === event.key ||
            key.keyCode > 0 && key.keyCode === event.keyCode
        ) &&
        key.alt === event.altKey &&
        key.ctrl === event.ctrlKey &&
        key.meta === event.metaKey &&
        key.shift === event.shiftKey
    )
}

export { isKeyPressed };

