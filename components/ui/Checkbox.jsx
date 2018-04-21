import * as React from "react"
import {StyleClass, ClassName} from "./init"
import "../../css/gui.css"

/**
 * @param {object} props
 *  -> className: String | Classes for the element.
 *      .disabled disables the checkbox.
 *      .checked marks the checkbox as checked.
 *  -> attributes: object | Additional attributes.
 */
class Checkbox extends React.Component {
    toggleActive(e) {
        if(!e.target.className.contains(StyleClass.Disabled)) {
            const isChecked = e.target.className.contains(StyleClass.Checked)
                && e.target.checked === true

            e.target.className[!isChecked ? "add" : "remove"](StyleClass.Checked)
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