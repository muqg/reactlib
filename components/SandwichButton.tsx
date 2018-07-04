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


class SandwichButton extends React.PureComponent<Props, State> {
    state = {
        active: false
    }

    handleClick = (event: React.MouseEvent<any>) => {
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
                    onClick={this.handleClick}
                >
                    <span></span>
                </button>
            </div>
        )
    }
}


export default SandwichButton
