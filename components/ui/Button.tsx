import * as React from "react"
import "../../css/ui/button.css"
import ICommonProps from "./ICommonProps";
import { classNames } from "../../utility/dom";

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
            className={classNames("l_gui_button", className)}
            type="button"
            onClick={onClick}
            {...attributes}
        >
            {text}
        </button>
    )
}

export default Button
