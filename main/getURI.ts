import { CURRENT_LOCALE } from "./const";

/**
 * Returns a URI with locale prepended.
 * @param path Target URI path, without locale string.
 */
export const getURI = (path = '') => {
    return '/' + CURRENT_LOCALE + path;
}
