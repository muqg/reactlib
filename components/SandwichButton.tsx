import * as React from "react";
import "../css/sandwich_button.css";
import { StyleClass } from "../utility";
import { classNames } from "../utility/dom";

interface Props {
    attributes?: {}
    className?: string
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
    state = {
        active: false
    }

    handleClick(event: React.MouseEvent<any>) {
        const active = !this.state.active
        this.setState(prevState => {
            return {active: !prevState.active}
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
