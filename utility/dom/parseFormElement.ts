import { isObject } from "../assertions";
import { StringDict } from "..";


export interface ParsedObject extends StringDict<string> {
    value: string
}

/**
 * Parses attribute values off a form element.
 * @param element The element to be parsed. Only element.value is parsed
 * by default unless additional values are provided.
 * @param additionalValues Names of additional element values to be added
 * to the parsed data. If at least one additional value is supplied then the
 * resulting parsed data will be converted to object instead of a single value.
 */
export function parseFormElement(element: HTMLFormElement, includeData = false): string | ParsedObject {
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

    let result = value
    if(includeData) {
        result = {
            value: value,
            ...element.dataset
        }
    }

    return result
}
