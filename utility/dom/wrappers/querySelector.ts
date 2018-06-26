/**
 * Finds a DOM element by its selector or throws an error otherwise.
 * @param selector Element selector.
 */
function querySelector<T extends Element = Element>(selector: string): T {
    const element = document.querySelector<T>(selector)
    if(element)
        return element
    throw "Empty selector result."
}

export { querySelector }
