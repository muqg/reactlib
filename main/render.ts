import * as ReactDOM from "react-dom";

/**
 * Renders JSX as DOM inside page's element with id="contentContainer", using
 * ReactDOM.
 * @param element Valid JSX element to be rendered.
 */
export function render(element: JSX.Element) {
    ReactDOM.render(
        element,
        document.getElementById("contentContainer") as HTMLElement
    )
}
