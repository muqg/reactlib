import * as React from "react";
import "../../css/ui/checkbox.css";
import { ClassName, StyleClass } from "./init";

/**
 * - attributes - Key/value pairs of additional attributes.
 * - className - Additional classes for the component.
 *      - .disabled - Disables the checkbox.
 *      - .checked - Marks the checkbox as checked.
 * - onClick - An optional Callback() to handle click event.
 */
class Checkbox extends React.Component {
    toggleActive(e) {
        if(e.target.className.indexOf(StyleClass.Disabled) < 0) {
            const isChecked = e.target.className.indexOf(StyleClass.Checked) >= 0
                && e.target.checked === true

            e.target.classList[!isChecked ? "add" : "remove"](StyleClass.Checked)
            e.target.checked = !isChecked

            e.target.dispatchEvent(new Event("change"))
        }

        if(typeof this.props.onClick === "function")
            this.props.onClick()
    }

    render() {
        const className = this.props.className || ""
        return (
            <span
                className={[ClassName.Checkbox, className].join(" ")}
                checked={className.indexOf(StyleClass.Checked) >= 0 ? true : false}
                onClick={(e) => this.toggleActive(e)}
                {...this.props.attributes}
            >
            </span>
        )
    }
}

export default Checkbox