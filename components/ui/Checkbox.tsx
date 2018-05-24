import * as React from "react";
import "../../css/ui/checkbox.css";
import ICommonProps from "./ICommonProps";
import { ClassName, StyleClass } from "./init";

interface IProps extends ICommonProps {
    onClick: () => void
}

/**
 * - attributes - Key/value pairs of additional attributes.
 * - className - Additional classes for the component.
 *      - .disabled - Disables the checkbox.
 *      - .checked - Marks the checkbox as checked.
 * - onClick - An optional Callback() to handle click event.
 */
class Checkbox extends React.Component {
    constructor(public props: IProps) {
        super(props)
    }

    toggleActive(event: React.MouseEvent<any>) {
        const target = event.target as HTMLInputElement
        if(target.className.indexOf(StyleClass.Disabled) < 0) {
            const isChecked = target.className.indexOf(StyleClass.Checked) >= 0
                && target.checked === true

            target.classList[!isChecked ? "add" : "remove"](StyleClass.Checked)
            target.checked = !isChecked

            target.dispatchEvent(new Event("change"))
        }

        this.props.onClick()
    }

    render() {
        const className = this.props.className
        return (
            <span
                className={[ClassName.Checkbox, className].join(" ")}
                // @ts-ignore Until fixed.
                checked={className.indexOf(StyleClass.Checked) >= 0 ? true : false}
                onClick={(e) => this.toggleActive(e)}
                {...this.props.attributes}
            >
            </span>
        )
    }
}

export default Checkbox