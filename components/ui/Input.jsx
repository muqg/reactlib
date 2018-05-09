import * as React from "react"
import {ClassName} from "./init"
import "../../css/ui/input.css"

/**
 * - attributes - Key/value pairs of additional attributes.
 * - className - Additional classes for the component.
 * - onChange - An optional Callback() to handle input change.
 * - type - Input's type.
 */
function Input({type, className, attributes, onChange}) {
    return (
        <input
            className={[ClassName.Input, className].join(" ")}
            type={type || "text"}
            onChange={onChange}
            {...attributes}
        />
    )
}

export default Input