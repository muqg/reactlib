/**
 * Finds DOM elements by selector or throws an error if none are found.
 * @param selector Element selector.
 */
function querySelectorAll<T extends Element = Element>(selector: string): NodeListOf<T> {
    const elements = document.querySelectorAll<T>(selector)
    if(elements.length)
        return elements
    throw "Empty selector result."
}

export { querySelectorAll }
