/**
 * Parses a valid query string into object of parameters.
 * @param query The query string to be parsed.
 */
function parseQuery(query: string) : object {
    query = query.replace("?", "")

    // Replace '&' and '=' with "," and ":" respectively.
    const replacedQuery = query.replace(/&/g, '","').replace(/=/g,'":"')
    return JSON.parse(
        '{"' + replacedQuery + '"}',
        (key, value) => key === "" ? value : decodeURIComponent(value)
    )
}


export default parseQuery