import * as ReactDOM from "react-dom"

/**
 * Renders JSX as DOM inside page's element with id="contentContainer", using
 * ReactDOM.
 * @param {JSX.Element} element Valid JSX element to be rendered.
 */
const render = (element) => {
    ReactDOM.render(
        element,
        document.getElementById("contentContainer")
    )
}


export default render
