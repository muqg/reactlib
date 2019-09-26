/**
 * Attempts to find a parent element with matching class name.
 * @param element The root element to start searching from.
 * @param className The classname to match.
 */
export function findParentWithClass<T extends HTMLElement = HTMLElement>(
  element: HTMLElement,
  className: string,
): T | null {
  const parent = element.parentElement
  if (parent && parent.nodeName !== "HTML") {
    if (parent.classList && parent.classList.contains(className)) {
      return parent as T
    }
    return findParentWithClass(parent, className) as T
  }
  return null
}
