/**
 * Appends a valid link stylesheet element to the DOM head element.
 * @param href Hyperlink path to the stylesheet.
 */
export function loadStyle(href: string) {
    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = href
        document.getElementsByTagName("head")[0].appendChild(link)
        return link
    }
    return null
}
