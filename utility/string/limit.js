const limit = (str = "", maxLen = 12, addDots = true) => {
    if(str.length > maxLen)
        return str.substring(0, maxLen) + (addDots ? "..." : "")
    return str
}


export default limit
