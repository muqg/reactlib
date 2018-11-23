import { useEffect } from "react";
import { Hotkey, isKeyPressed } from "../utility/dom";

const handlers: Array<HotkeyHandlerCallback> = []

type HotkeyHandlerCallback = (e: KeyboardEvent) => void

/**
 * Sets up a global hotkey.
 *
 * @param hotkey Hotkey data.
 * @param handle The handler callback.
 * @param allowInsideInputs Whether to allow hotkey to be triggered from inside inputs.
 */
function useGlobalHotkey(hotkey: Hotkey, handle: HotkeyHandlerCallback, allowInsideInputs?: boolean) {
    useEffect(() => {
        if(!handlers.length)
            window.addEventListener("keydown", handleEvents)

        const handler: HotkeyHandlerCallback = (event) => {
            if(isKeyPressed(hotkey, event, allowInsideInputs))
                handle(event)
        }
        handlers.push(handler)

        return () => {
            const target = handlers.find(h => h === handler)
            if(target)
                handlers.splice(handlers.indexOf(target), 1)

            if(!handlers.length)
                window.removeEventListener("keydown", handleEvents)
        }
    })
}

function handleEvents(e: KeyboardEvent) {
    handlers.forEach(h => h(e))
}


export { useGlobalHotkey };

