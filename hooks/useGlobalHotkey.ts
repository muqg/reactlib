import {useEffect} from "react"
import {Hotkey, isKeyPressed} from "../utility/dom"

/**
 * Sets up a global hotkey.
 *
 * @param hotkey Hotkey data.
 * @param handle The handler callback.
 * @param allowInsideInputs Whether to allow hotkey to be triggered from inside inputs.
 */
function useGlobalHotkey(
  hotkey: Hotkey,
  handle: (e: KeyboardEvent) => void,
  allowInsideInputs?: boolean
) {
  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if (isKeyPressed(hotkey, event, allowInsideInputs)) {
        handle(event)
      }
    }

    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  })
}

export {useGlobalHotkey}
