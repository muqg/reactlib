import { isObject } from "../assertions";


/**
 * Parses attribute values off a form element.
 * @param element The element to be parsed. Only element.value is parsed
 * by default unless additional values are provided.
 */
export function parseFormElement(element: HTMLFormElement): string {
    const name = element.name
    if(!name)
        throw("Name attribute is required for serializable form nodes.")

    let value = element.value
    if(element.type === "checkbox" || element.type === "radio") {
        value = element.checked
    }
    if(isObject(element, HTMLSelectElement) && element.multiple) {
        // @ts-ignore HTMLOptionsCollection can safely be transformed into an array.
        value = [...element.options].filter(o => o.selected).map(o => o.value).join(",")
    }

    return value
}
