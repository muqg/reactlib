import * as React from "react"
import {ClassName} from "./init"
import "../../css/ui/button.css"

/**
 * @param {object} props
 *  -> text: string | Button's text.
 *  -> className: string | Additional classes as a string.
 *  -> attributes: object | Additional attributes.
 *  -> onClick: function | The callback function for when the button is clicked.
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