
/**
 * Creates a valid search query string from object of parameters.
 * @param params Object with parameters.
 */
export function createQuery(params: object): string {
    return Object.entries(params).map(([key, value]) => {
        const encodedValue = encodeURIComponent(value)
        if(encodedValue.length) {
            return encodeURIComponent(key) + "=" + encodedValue
        }
    }).filter(p => p).join("&")
}
