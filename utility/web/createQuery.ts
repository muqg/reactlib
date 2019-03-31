/**
 * Creates a valid search query string from object of parameters.
 * @param params Object with parameters.
 */
export function createQuery(params: object): string {
    return Object.entries(params)
        .map(
            ([key, value]) =>
                encodeURIComponent(key) + "=" + encodeURIComponent(value)
        )
        .filter(p => p)
        .join("&")
}
