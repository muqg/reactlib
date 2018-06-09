import { StringDict } from "../interfaces";

/**
 * Creates a valid search query string from object of parameters.
 * @param params Object with parameters.
 */
export function createQuery(params: StringDict<any>): string {
    return Object.keys(params).map(
        key => encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
    ).join("&")
}
