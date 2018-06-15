
/**
 * Attempts to find a parent element with matching class name.
 * @param element The root element to start searching from.
 * @param className The classname to match.
 */
function findParentWithClass(element: HTMLElement, className: string): HTMLElement | null {
    const parent = element.parentElement;
    if(parent && parent.nodeName !== "HTML") {
        if(parent.classList && parent.classList.contains(className))
            return parent;
        else
            return findParentWithClass(parent, className);
    }
    return null;
}

export {
    findParentWithClass
}
