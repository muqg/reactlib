/**
 * Checks whether an element is within user's viewport. Does not work on hidden
 * elements.
 * @param element The element to be checked for.
 */
function inViewport(element: Element): boolean
/**
 * Checks whether an element is within user's viewport. Does not work on hidden
 * elements.
 * @param element The element to be checked for.
 * @param offset Viewport offset around the element.
 */
function inViewport(element: Element, offset: number): boolean

function inViewport(element: Element, offset = 0) {
    const rect = element.getBoundingClientRect()
    const viewport = {
        top: rect.top - window.innerHeight - offset,
        bottom: rect.bottom + offset,
        left: rect.left - window.innerWidth - offset,
        right: rect.right + offset
    }

    return (
        (viewport.top <= 0 && viewport.bottom >= 0)
        &&
        (viewport.left <= 0 && viewport.right >= 0)
    )
}


export default inViewport
