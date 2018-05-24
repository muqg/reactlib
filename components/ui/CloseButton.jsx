import * as React from "react"
import {ClassName} from "./init"
import "../../css/ui/close_button.css"

/**
 * - attributes - Key/value pairs of additional attributes.
 * - className - Additional classes for the component.
 * - onClick - An optional Callback() to handle click event.
 */
function CloseButton({className = "", attributes = {}, onClick}) {
    return (
        <button
            className={[ClassName.Close, className].join(" ")}
            onClick={onClick}
            type="button"
            {...attributes}
        >
            <span></span>
        </button>
    )
}

export default CloseButton