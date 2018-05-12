/**
 * Parses attribute values off a form element.
 * @param {object} element The element to be parsed. Only element.value is parsed
 * by default unless additional values are provided.
 * @param {Array} additionalValues Names of additional element values to be added
 * to the parsed data. If at least one additional value is supplied then the
 * resulting parsed data will be converted to object instead of a single value.
 */
const parseFormElement = (element, includeData = false) => {
    const value = element.type === "checkbox" || element.type === "radio" ?
        element.checked : element.value
    const name = element.name

    if(!name)
        throw("Name attribute is required for serializable (changeable) form nodes.")

    let result;
    if(includeData) {
        result = {
            [name]: {
                value: value,
                ...element.dataset
            }
        }
    }
    else {
        result = {
            [name]: value
        }
    }

    return result
}


export default parseFormElement
