import * as React from "react";
import "../../css/ui/checkbox.css";
import ICommonProps from "./ICommonProps";
import { StyleClass } from "../../utility/enums";
import { classNames } from "../../utility/dom";

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
    // TODO: React | Implement with hidden input instead of change event and
    // this way drop usave of "checked" class.
    constructor(public readonly props: IProps) {
        super(props)
    }

    toggleActive(event: React.MouseEvent<any>) {
        const target = event.target as HTMLInputElement
        if(target.className.indexOf(StyleClass.Disabled) < 0) {
            const isChecked = target.className.indexOf("checked") >= 0
                && target.checked === true

            target.classList[!isChecked ? "add" : "remove"]("checked")
            target.checked = !isChecked

            target.dispatchEvent(new Event("change"))
        }

        this.props.onClick()
    }

    render() {
        const className = this.props.className
        return (
            <span
                className={classNames("l_gui_checkbox", this.props.className)}
                // @ts-ignore Until fixed.
                checked={className.indexOf("checked") >= 0 ? true : false}
                onClick={(e) => this.toggleActive(e)}
                {...this.props.attributes}
            >
            </span>
        )
    }
}

export default Checkbox