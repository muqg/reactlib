import * as React from "react";
import "../../css/ui/sandwich_button.css";
import ICommonProps from "./ICommonProps";
import { StyleClass } from "../../utility/enums";
import { classNames } from "../../utility/dom";

interface Props extends ICommonProps {
    onClick?: (isActive: boolean, e: React.MouseEvent<any>) => void
}

interface State {
    active: boolean
}

/**
 * - attributes - Key/value pairs of additional attributes.
 * - className - Additional classes for the component.
 * - onClick - An optional Callback(isActive) to handle click event.
 */
class SandwichButton extends React.Component<Props, State> {
    constructor(public readonly props: Props) {
        super(props)

        this.state = {
            active: false
        }
    }

    handleClick(event: React.MouseEvent<any>) {
        const active = !this.state.active
        this.setState({
            active
        })

        if(this.props.onClick)
            this.props.onClick(active, event)
    }

    render() {
        const classes = classNames(
            "l_sandwich",
            this.props.className,
            {
                [StyleClass.Active]: this.state.active,
            }
        )

        return (
            <div className="l_sandwich_container" {...this.props.attributes}>
                <button
                    className={classes}
                    onClick={this.handleClick.bind(this)}
                >
                    <span></span>
                </button>
            </div>
        )
    }
}


export default SandwichButton
