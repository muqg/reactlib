import { Dict } from "..";
import { isUndefined } from "../assertions";

/**
 * Removes undefined values from a collection object.
 * @param col The collection to clean.
 */
function clean(col: object) {
    const res: Dict<any> = {}

    Object.entries(col).forEach(([key, value]) => {
        if(!isUndefined(value))
            res[key] = value
    })

    return res
}


export { clean }
