import * as React from "react"
import {ClassName} from "./init"
import "../../css/ui/close_button.css"

/**
 * @param {object} props
 * -> className: string | Additional classes as a string.
 * -> attributes: object | Additional attributes.
 */
function CloseButton({className, attributes}) {
    return (
        <button
            className={[ClassName.Close, className].join(" ")}
            type="button"
            {...attributes}
        >
            <span></span>
        </button>
    )
}

export default CloseButton