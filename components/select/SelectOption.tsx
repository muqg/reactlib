import * as React from "react";

interface Props {
    name: string
    children?: any
    text?: string
    value?: string
}

class SelectOption extends React.Component {
    constructor(public props: Props) {
        super(props)
    }

    render() {
        return (
            <label>
                <input type="radio" name={this.props.name} value={this.props.value} />
                <p>{this.props.text || this.props.value}</p>
                {this.props.children}
            </label>
        )
    }
}


export default SelectOption
