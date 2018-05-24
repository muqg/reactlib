import * as React from "react"
import {ClassName} from "./init"
import "../../css/ui/button.css"
import ICommonProps from "./ICommonProps";

interface IProps extends ICommonProps {
    onClick: (e: React.MouseEvent<any>) => void
    text: string
}

/**
 * - attributes - Key/value pairs of additional attributes.
 * - className - Additional classes for the component.
 * - onClick - An optional Callback() to handle click event.
 * - text - Button's text.
 */
function Button({text, onClick, className = "", attributes = {}}: IProps) {
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
