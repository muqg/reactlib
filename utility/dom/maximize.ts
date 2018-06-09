import { isUndefined } from "../assertions";

/**
 * Sets an element to its maximum height or removes the inline styling for its height.
 * @param element The target element.
 * @param height Whether to set or remove the inline height styling.
 */
function maximize(element: HTMLElement, height: boolean): void
/**
 * Sets an element to its maximum height and/or width or removes the inline
 * styling for its height and/or width.
 * @param element The target element.
 * @param height Whether to maximize or remove the inline height styling.
 * @param width Whether to maximize or remove the inline width styling.
 */
function maximize(element: HTMLElement, height: boolean, width: boolean): void

function maximize(element: HTMLElement, height: boolean, width?: boolean) {
    element.style.height = height ? element.scrollHeight + "px" : ""

    if(!isUndefined(width))
        element.style.width = width ? element.scrollWidth + "px" : ""
}

export default maximize
