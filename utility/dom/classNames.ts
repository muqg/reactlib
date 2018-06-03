import { isString, isNumber, isObject, isArray } from "../assertions"

interface ClassNames {
    [key: string]: boolean
}

/**
 * Builds a dom element class name string.
 * @param ...classArgs A variable number of strings, numbers and
 * objects to combine into the class name string. Any invalid or
 * duplicate values will be discarded. Duplicate object values
 * that are truthy take precedence over falsey ones.
 */
function classNames(...classArgs: (string | number | object)[]): string {
    const classes: ClassNames = {}

    classArgs.forEach(arg => {
        if (!arg) return

        if(isString(arg) || isNumber(arg)) {
            classes[arg] = true
        }
        else if(isObject(arg) && !isArray(arg)) {
            for (let cls in arg) {
                // Always prefers the TRUE value, i.e. class is applied
                // if at least one of the duplicate values is TRUE.
                classes[cls] = arg[cls] || classes[cls]
            }
        }
    })

    return Object.keys(classes).filter(k => classes[k]).join(" ")
}


export default classNames