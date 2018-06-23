import * as React from "react";
import "../../css/checkbox.css";
import { StyleClass } from "../utility";
import { classNames } from "../utility/dom";

interface Props {
    attributes?: {}
    className?: string
    onClick: () => void
}

// TODO: React | Implement with hidden input instead of change event and
// this way drop usave of "checked" class.
class Checkbox extends React.Component<Props> {
    constructor(public readonly props: Props) {
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