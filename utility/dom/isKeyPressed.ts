import { Hotkey } from ".";
import { isObject, isType } from "../assertions";

/**
 * Determines whether a keyboard event corresponds to a key being pressed.
 * Keypress when user is typing input is always False.
 * @param hotkey Target hotkey data.
 * @param event The keyboard event.
 */
function isKeyPressed(hotkey: Hotkey, event: KeyboardEvent | React.KeyboardEvent): boolean {
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
            (hotkey.code && hotkey.code === event.code) ||
            (hotkey.eventKey && hotkey.eventKey === event.key) ||
            (hotkey.keyCode > 0 && hotkey.keyCode === event.keyCode)
        ) &&
        hotkey.alt === event.altKey &&
        hotkey.ctrl === event.ctrlKey &&
        hotkey.meta === event.metaKey &&
        hotkey.shift === event.shiftKey
    )
}

export { isKeyPressed };

