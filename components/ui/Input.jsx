import * as React from "react"
import {ClassName} from "./init"
import "../../css/gui.css"

/**
 * @param {any} props
 *  -> type: string | The type of the input.
 *  -> classList: string | Additional classes as a string.
 *  -> attributes: object | Additional attributes.
 */
function Input({type = "", classList = "", attributes}) {
    return (
        <input
            className={[ClassName.Input, classList].join(" ")}
            type={type || "text"}
            {...attributes}
        />
    )
}

export default Input