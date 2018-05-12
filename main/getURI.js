import { CURRENT_LOCALE } from "./const"

/**
 * Returns a URI with locale prepended.
 * @param {string} path Target URI path, without locale string.
 */
const getURI = (path = '') => {
    return '/' + CURRENT_LOCALE + path;
}


export default getURI
