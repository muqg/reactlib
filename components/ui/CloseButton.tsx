import * as React from "react";
import "../../css/ui/close_button.css";
import { classNames } from "../../utility/dom";
import ICommonProps from "./ICommonProps";

interface IProps extends ICommonProps {
    onClick: (e: React.MouseEvent<any>) => void
}

/**
 * - attributes - Key/value pairs of additional attributes.
 * - className - Additional classes for the component.
 * - onClick - An optional Callback() to handle click event.
 */
function CloseButton({className = "", attributes = {}, onClick}: IProps) {
    return (
        <button
            className={classNames(".l_gui_close", className)}
            onClick={onClick}
            type="button"
            {...attributes}
        >
            <span></span>
        </button>
    )
}

export default CloseButton
