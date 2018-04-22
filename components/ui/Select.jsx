import * as React from "react"
import {StyleClass, ClassName, findGuiParent} from "./init"
import "../../css/ui/select.css"

// TODO: Split into different components -> MultipleSelect, Select

/**
 * SELECT
 * Props
 *  -> name: String | The name of the inputs.
 *  -> title: String | The title of the first element if select is not multiple.
 *  -> options: Array | Selectable options as an array of objects such as:
 *                      [{"id": id, "text": text}, {"id": id, "text": text }]
 *  -> className: String | Classes for the element.
 *      .multiple makes it a multiple select
 *  -> attributes: object | Additional attributes.
*/
class Select extends React.Component {
    constructor(props) {
        super(props)

        this.className = this.props.className || ""
        this.isMultiple = this.className.indexOf(StyleClass.Multiple) >= 0
    }

    componentDidMount() {
        ReactDOM.findDOMNode(this).addEventListener("focused", this.onFocus)
    }

    componentWillUnmount() {
        ReactDOM.findDOMNode(this).removeEventListener("focused", this.onFocus)
    }

    getOptions() {
        const type = this.isMultiple ? "checkbox" : "radio"
        const title = this.props.title || ""
        const hasTitleElement = title.length > 0

        const customStyle = {
            lineHeight: this.props.height,
        }

        let options =
            (this.props.options || []).map((currentOption, index) => {
                const id = currentOption.id || currentOption.text
                return (
                    <label key={id}>
                        <input type={type} name={this.props.name} data-id={id}
                            onChange={this.onOptionChange} />
                        <p style={customStyle}>{currentOption.text}</p>
                    </label>
                )
            })

        if(!this.isMultiple && hasTitleElement) {
            options.unshift(
                <label key="na">
                    <input type={type} name={this.props.name} defaultChecked
                        onChange={this.onOptionChange} />
                    <p style={customStyle}>{title}</p>
                </label>
            )
        }
        return options
    }

    render() {
        const customStyle = {
            height: this.props.height,
            width: this.props.width,
        }

        return(
            <div className={[ClassName.Select, this.className].join(" ")}
                style={customStyle}
                {...this.props.attributes}
            >
                <div tabIndex="-1">
                    {this.getOptions()}
                </div>
            </div>
        )
    }

    onFocus(e) {
        e.stopPropagation()
        const selected = e.target.querySelector("input:checked").parentNode
        selected.parentNode.scrollTop = selected.offsetTop - selected.offsetHeight
    }

    onOptionChange(e) {
        findGuiParent(e.target).classList.remove(StyleClass.Focused)
    }
}

export default Select