import * as React from "react";
import "../css/sandwich_button.css";
import { StyleClass } from "../utility";
import { classNames } from "../utility/dom";


interface Props {
    className?: string
    onClick?: (isActive: boolean, e: React.MouseEvent<any>) => void
    /**
     * Close button's size in pixels. This accounts for both width and height.
     */
    size?: number
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

        let style = {}
        if(this.props.size) {
            const size = this.props.size + "px";
            style = {
                height: size,
                width: size
            }
        }

        return (
            <div className="l_sandwich_container">
                <button
                    className={classes}
                    onClick={this.handleClick}
                    style={style}
                >
                    <span></span>
                </button>
            </div>
        )
    }
}


export default SandwichButton
