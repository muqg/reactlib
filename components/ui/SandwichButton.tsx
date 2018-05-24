import * as React from "react";
import "../../css/ui/sandwich_button.css";
import ICommonProps from "./ICommonProps";

interface IProps extends ICommonProps {
    onClick?: (isActive: boolean, e: React.MouseEvent<any>) => void
}

interface IState {
    active: boolean
}

/**
 * - attributes - Key/value pairs of additional attributes.
 * - className - Additional classes for the component.
 * - onClick - An optional Callback(isActive) to handle click event.
 */
class SandwichButton extends React.Component {
    public state: IState

    constructor(public props: IProps) {
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
        const classes = "l_sandwich" +
            (this.state.active ? " active" : "")

        return (
            <div className="l_sandwich_container" {...this.props.attributes}>
                <button
                    className={[classes, this.props.className].join(" ")}
                    onClick={this.handleClick.bind(this)}
                >
                    <span></span>
                </button>
            </div>
        )
    }
}


export default SandwichButton
