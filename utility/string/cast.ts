import {asFloat, asInt} from "."

/**
 * Casts (parses) a string to a boolean, integer or float if it represents one.
 * @param str The string to cast.
 */
function cast<T extends string | number | boolean>(str: string) {
    let res: string | number | boolean = str

    if (res.length) {
        // @ts-ignore isNaN works perfectly fine with strings.
        if (!isNaN(res)) {
            res = res.indexOf(".") >= 0 ? asFloat(res) : asInt(res)
        } else if (res === "true") {
            res = true
        } else if (res === "false") {
            res = false
        }
    }

    return res as T
}

export {cast}
