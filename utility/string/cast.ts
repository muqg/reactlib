/**
 * Casts (parses) a string to a boolean, integer or float if it represents one.
 * @param str The string to cast.
 */
function cast<T extends string | number | boolean>(str: string) {
    let res: string | number | boolean = str

    if (res.length) {
        // @ts-ignore isNaN works perfectly fine with strings.
        if (!isNaN(res)) {
            res = Number(res)
        } else if (res === "true") {
            res = true
        } else if (res === "false") {
            res = false
        }
    }

    return res as T
}

export {cast}
