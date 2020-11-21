import {Hotkey} from "."
import {isObject, isType} from "../assertions"

/**
 * Determines whether a keyboard event corresponds to a key being pressed.
 * Keypress when user is typing input is always False.
 * @param hotkey Target hotkey data.
 * @param event The keyboard event.
 * @param allowInsideInputs Whether to allow keypress inside input elements.
 */
export function isKeyPressed(
  hotkey: Hotkey,
  event: React.KeyboardEvent | KeyboardEvent,
  allowInsideInputs = false
): boolean {
  const target = event.target
  if (!allowInsideInputs && isObject(target, Element)) {
    const nodeName = target.nodeName.toLowerCase()
    if (
      nodeName === "input" ||
      nodeName === "textarea" ||
      target.hasAttribute("contenteditable")
    )
      return false
  }

  if (isType<React.KeyboardEvent>(event, (e) => e.nativeEvent))
    event = event.nativeEvent

  return (
    (hotkey.code === event.code ||
      hotkey.eventKey === event.key ||
      hotkey.keyCode === event.keyCode) &&
    (hotkey.alt === undefined || hotkey.alt === event.altKey) &&
    (hotkey.ctrl === undefined || hotkey.ctrl === event.ctrlKey) &&
    (hotkey.meta === undefined || hotkey.meta === event.metaKey) &&
    (hotkey.shift === undefined || hotkey.shift === event.shiftKey)
  )
}
