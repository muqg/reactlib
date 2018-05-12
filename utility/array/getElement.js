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
