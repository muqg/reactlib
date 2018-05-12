const format = (str, ...args) => {
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


export default format
