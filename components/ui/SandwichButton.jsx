import * as React from "react"
import "../../css/ui/sandwich_button.css"

/**
 * - attributes - Key/value pairs of additional attributes.
 * - className - Additional classes for the component.
 * - onClick - An optional Callback(isActive) to handle click event.
 */
class SandwichButton extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            active: false
        }
    }

    handleClick() {
        const active = !this.state.active
        this.setState({
            active
        })

        if(typeof this.props.onClick === "function")
            this.props.onClick(active)
    }

    render() {
        const classes = "l_sandwich" +
            (this.state.active ? " active" : "")

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
