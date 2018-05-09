import * as React from "react"
import {ClassName} from "./init"
import "../../css/ui/button.css"

/**
 * - attributes - Key/value pairs of additional attributes.
 * - className - Additional classes for the component.
 * - onClick - An optional Callback() to handle click event.
 * - text - Button's text.
 */
function Button({text, onClick, className, attributes}) {
    return (
        <button
            className={[ClassName.Button, className].join(" ")}
            type="button"
            onClick={onClick}
            {...attributes}
        >
            {text}
        </button>
    )
}

export default Button