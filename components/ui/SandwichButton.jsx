import * as React from "react"
import "../../css/ui/sandwich_button.css"

/**
 * - attributes - Key/value pairs of additional attributes.
 * - className - Additional classes for the component.
 * - onClick - An optional Callback() to handle click event.
 */
class SandwichButton extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            active: false
        }
    }

    handleClick() {
        this.setState({
            active: !this.state.active
        })

        if(typeof this.props.onClick === "function")
            this.props.onClick()
    }

    render() {
        const classes = ClassName.SandwichButton +
            (this.state.active ? " active" : "")

        return (
            <div className="l_sandwich" {...this.props.attributes}>
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
