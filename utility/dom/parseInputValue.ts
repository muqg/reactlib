import { findParentWithClass } from ".";
import { isObject, isType } from "../assertions";


export type ParseableElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement
export type ParseableInput = React.ChangeEvent<ParseableElement> | ParseableElement


/**
 * Parses an input value.
 * @param input The input change event or target element to parse the value of.
 */
function parseInputValue(input: ParseableInput): string {
    const element = isObject(input, Element) ? input : input.target
    let value = element.value

    // TODO: Remove this after reworking Select and MultipleSelect to work
    // with callbacks of type (name: string, value: string) => void
    const parentSelect = findParentWithClass(element, "l_select")
    if(parentSelect && isType<HTMLInputElement>(element, () => element.type === "checkbox" || element.type === "radio")) {
        // TODO: Lib | Better Model for multiple Select.
        if(parentSelect.classList.contains("multiple")) {
            const checked = parentSelect.querySelectorAll<HTMLInputElement>(":checked")
            value = Object.values(checked).map(c => c.value).join(",")
        }
    }
    // Parse checkbox and radio button.
    else if(isType<HTMLInputElement>(element, () => element.type === "checkbox" || element.type === "radio")) {
        if(value && value !== "on")
            value = element.checked ? value : ""
        else
            value = element.checked ? "true" : "false"
    }
    // Parse multiple selects.
    else if(isObject(element, HTMLSelectElement) && element.multiple) {
        value = Object.values(element.options)
            .filter(o => o.selected)
            .map(o => o.value).join(",")
    }

    return value
}


export { parseInputValue };

