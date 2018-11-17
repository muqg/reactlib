import { useEffect } from "react";
import { Hotkey, isKeyPressed } from "../utility/dom";

/**
 * Sets up a global hotkey.
 *
 * __Note__: Hotkey will be set up anew if the handler callback changes.
 *
 * @param hotkey Hotkey data.
 * @param handle The handler callback.
 * @param allowInsideInputs Whether to allow hotkey within inputs.
 */
function useGlobalHotkey(hotkey: Hotkey, handle: (event: KeyboardEvent) => any, allowInsideInputs?: boolean) {
    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if(isKeyPressed(hotkey, event, allowInsideInputs))
                handle(event)
        }

        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [handle])
}


export { useGlobalHotkey };

