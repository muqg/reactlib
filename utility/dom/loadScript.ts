/**
 * Appends a valid script element to the DOM head element.
 * @param src The hyperlink source to the script.
 */
export function loadScript(src: string) {
    if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement("script")
        script.src = src
        document.getElementsByTagName("head")[0].appendChild(script)
        return script
    }
    return null
}
