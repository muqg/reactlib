/**
 * Returns a nested array or object element, using dot notation key access.
 * @param {string} key The key to the element, using dot notation.
 * @param {object} obj The subject array or object.
 */
const getElement = (key, obj) => {
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


export default getElement
