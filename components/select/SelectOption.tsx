import * as React from "react";

interface Props {
    children?: any
    text?: string
    value?: string

    /**
     * Checked is passed internally by parent Select based on its provided value.
     * Checked attribute may also be set on individual SelectOptions but will be
     * overrriden in case of conflict with Select's value attribute.
     */
    checked?: boolean

    /**
     * Name is passed internally by parent Select.
     */
    name?: string
    /**
     * Type is passed internally by parent Select.
     */
    type?: "checkbox" | "radio"
}

class SelectOption extends React.Component {
    constructor(public props: Props) {
        super(props)
    }

    render() {
        return (
            <label>
                <input
                    type={this.props.type}
                    name={this.props.name}
                    value={this.props.value}
                    checked={this.props.checked}
                />
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
