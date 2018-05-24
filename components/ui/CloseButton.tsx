import * as React from "react";
import "../../css/ui/close_button.css";
import ICommonProps from "./ICommonProps";
import { ClassName } from "./init";

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
