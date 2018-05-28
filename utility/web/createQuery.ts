/**
 * Creates a valid search query string from object of parameters.
 * @param params Object with parameters.
 */
function createQuery(params: object) : string {
    return Object.keys(params).map(
        key => encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
    ).join("&")
}


export default createQuery
