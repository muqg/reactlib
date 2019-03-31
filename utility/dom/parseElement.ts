import {findParentWithClass} from "."
import {isObject, isString, isType} from "../assertions"
import {ParseableElement, ParseableInput} from "./parseInputValue"

/**
 * Parses a valid change event's element.
 * @param change The change event or element to be parsed.
 */
function parseElement(change: ParseableInput | string, val?: string) {
    let name: string
    let value: string

    if (!isString(change)) {
        const element = isObject(change, Element)
            ? change
            : (change.target as ParseableElement)
        name = element.name
        value = element.value

        // TODO: Remove this after reworking Select and MultipleSelect to work
        // with callbacks of type (name: string, value: string) => void
        const parentSelect = findParentWithClass(element, "l_select")
        if (
            parentSelect &&
            isType<HTMLInputElement>(
                element,
                () => element.type === "checkbox" || element.type === "radio"
            )
        ) {
            name = parentSelect.dataset["name"] || ""

            // TODO: Lib | Better Model for multiple Select.
            if (parentSelect.classList.contains("multiple")) {
                const checked = parentSelect.querySelectorAll<HTMLInputElement>(
                    ":checked"
                )
                value = Object.values(checked)
                    .map(c => c.value)
                    .join(",")
            }
        }
        // Parse checkbox and radio button.
        else if (
            isType<HTMLInputElement>(
                element,
                () => element.type === "checkbox" || element.type === "radio"
            )
        ) {
            if (value && value !== "on") value = element.checked ? value : ""
            else value = element.checked ? "true" : "false"
        }
        // Parse multiple selects.
        else if (isObject(element, HTMLSelectElement) && element.multiple) {
            value = Object.values(element.options)
                .filter(o => o.selected)
                .map(o => o.value)
                .join(",")
        }
    }
    // Parse for change callbacks of type (name: string, value: string) => void
    else {
        name = change
        value = val || ""
    }

    return {name, value}
}

export {parseElement}
