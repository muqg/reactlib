import * as React from "react";
import "../../css/ui/input.css";
import ICommonProps from "./ICommonProps";
import { ClassName } from "./init";

interface IProps extends ICommonProps {
    onChange?: (e: React.ChangeEvent<any>) => void
    type?: string
}

/**
 * - attributes - Key/value pairs of additional attributes.
 * - className - Additional classes for the component.
 * - onChange - An optional Callback() to handle input change.
 * - type - Input's type.
 */
function Input({type = "text", className = "", attributes = {}, onChange}: IProps) {
    return (
        <input
            className={[ClassName.Input, className].join(" ")}
            type={type}
            onChange={onChange}
            {...attributes}
        />
    )
}

export default Input
