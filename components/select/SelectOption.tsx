import * as React from "react";

interface Props {
    children?: any
    text?: string
    value?: string

    /**
     * Name is passed internally by parent Select.
     */
    name?: string
    /**
     * Type is passed internally by parent Select.
     */
    type?: string
}

class SelectOption extends React.Component {
    constructor(public props: Props) {
        super(props)
    }

    render() {
        return (
            <label>
                <input type={this.props.type} name={this.props.name} value={this.props.value} />
                <div>
                    <p>
                        {this.props.text || this.props.value}
                    </p>
                    {this.props.children}
                </div>
            </label>
        )
    }
}


export default SelectOption
