/**
 * Fisher-Yates shuffle.
 * @param {any} array The array to shuffle.
 */
export function shuffle(array) {
    // Copy into a new array in order to not affect the other one.
    const newArray = array.slice()

    let currentIndex = newArray.length
    while (currentIndex !== 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        let temporaryValue = newArray[currentIndex]
        newArray[currentIndex] = newArray[randomIndex]
        newArray[randomIndex] = temporaryValue
    }
    return newArray
}


export function clamp(value = 0, min = 0, max = 0) {
    return Math.min(Math.max(value, min), max)
}


export function findParentWithClass(element, classname) {
    const parent = element.parentNode
    if(parent && parent.nodeName !== "HTML") {
        if(parent.classList && parent.classList.contains(classname))
            return parent
        else
            return findParentWithClass(parent, classname)
    }
    return null
}

export function getElement(key, obj) {
    const split = key.split(".")
    const type = typeof obj
    if(type !== "object")
        throw (`Second argument must be of type object, ${type} given.`)

    let result = obj
    for(let k of split) {
        if(typeof result === "object")
            result = result[k] || null
    }
    return result
}

export function formatString(str, ...args) {
    const type = typeof str
    if(type !== "string")
        throw (`First argument must be of type string, ${type} given.`)

    const namedValues = args[0] || null
    if(namedValues && typeof namedValues === "object" && !(namedValues instanceof Array)) {
        for(let key in namedValues)
            str = str.replace(`{${key}}`, namedValues[key])
    }
    else {
        for(let i = 0; i < args.length; i++)
            str = str.replace(`{${i}}`, args[i])
    }

    return str
}

export function limitString(str = "", maxLen = 12, addDots = true) {
    if(str.length > maxLen)
        return str.substring(0, maxLen) + (addDots ? "..." : "")
    return str
}

/**
 * Parses attribute values off a form element.
 * @param {object} element The element to be parsed. Only element.value is parsed
 * by default unless additional values are provided.
 * @param {Array} additionalValues Names of additional element values to be added
 * to the parsed data. If at least one additional value is supplied then the
 * resulting parsed data will be converted to object instead of a single value.
 */
export function parseFormElement(element, additionalValues = []) {
    const value = element.type === "checkbox" || element.type === "radio" ?
        element.checked : element.value
    const name = element.name

    if(!name)
        throw("Name attribute is required for serializable (changeable) form nodes.")

    let result;
    if(additionalValues.length) {
        result = {
            [name]: {
                value: value
            }
        }

        for(let val of additionalValues)
            result[name][val] = element[val]
    }
    else {
        result = {
            [name]: value
        }
    }

    return result
}
