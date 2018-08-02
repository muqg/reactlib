import { findParentWithClass } from ".";
import { isObject, isType } from "../assertions";

export type ParseableChange = React.ChangeEvent<ParseableElement> | ParseableElement
export type ParseableElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement

/**
 * Parses a valid change event's element.
 * @param change The change event or element to be parsed.
 */
function parseElement(change: ParseableChange) {
    const element = isObject(change, Element) ? change : change.target as ParseableElement
    let name = element.name
    let value = element.value

    if(isType<HTMLInputElement>(element, () => element.type === "checkbox" || element.type === "radio")) {
        const parentSelect = findParentWithClass(element, "l_select")
        // TODO: Lib | Model for multiple Select.
        if(parentSelect)
            name = parentSelect.dataset["name"] || ""
        value = element.checked ? value : ""
    }
    else if(isObject(element, HTMLSelectElement) && element.multiple) {
        value = Object.values(element.options)
            .filter(o => o.selected)
            .map(o => o.value).join(",")
    }

    return { name, value }
}


export { parseElement };