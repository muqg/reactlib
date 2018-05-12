import { CURRENT_LOCALE } from "./const"

const getURI = (path = '') => {
    return '/' + CURRENT_LOCALE + path;
}


export default getURI
