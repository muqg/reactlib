import * as React from "react";
import { findDOMNode } from "react-dom";
import { isObject } from "../../utility/assertions";

interface Props {
    children?: any
    value?: string

    /**
     * Checked is passed internally by parent Select based on its provided value.
     * Checked attribute may also be set on individual SelectOptions but will be
     * overrriden in case of conflict with Select's value attribute.
     */
    selected?: boolean

    /**
     * Name is passed internally by parent Select.
     */
    name?: string
    /**
     * Type is passed internally by parent Select.
     */
    type?: "checkbox" | "radio"
    /**
     * onClick is passed internally by parent Select.
     */
    onClick?: () => void
}

class SelectOption extends React.Component<Props> {
    constructor(public props: Props) {
        super(props)
    }

    componentDidMount() {
        if(!this.props.selected)
            return

        const element = findDOMNode(this)
        if(isObject(element, HTMLElement)) {
            const input = element.querySelector("input")
            if(input)
                input.checked = true
        }
    }

    render() {
        return (
            <label>
                <input
                    type={this.props.type}
                    name={this.props.name}
                    value={this.props.value}
                    onClick={this.props.onClick}
                />
                <div className="l_option_content">
                    {this.props.children || this.props.value}
                </div>
            </label>
        )
    }
}


export default SelectOption
