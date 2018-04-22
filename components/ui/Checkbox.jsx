import * as React from "react"
import {StyleClass, ClassName} from "./init"
import "../../css/ui/checkbox.css"

/**
 * @param {object} props
 *  -> className: String | Classes for the element.
 *      .disabled disables the checkbox.
 *      .checked marks the checkbox as checked.
 *  -> attributes: object | Additional attributes.
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