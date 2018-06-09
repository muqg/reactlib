import * as React from "react";
import { isUndefined } from "../../utility/assertions";
import { classNames, OutsideAlerter } from "../../utility/dom";
import { StyleClass } from "../../utility/enums";
import SelectOption from "./SelectOption";
import "../../css/select.css"

interface Props {
    name: string
    /**
     * Value of checked option or options if select is multiple.
     */
    value?: string
    /**
     * Whether select is a multiple choice.
     */
    multiple?: boolean
    className?: string
    children?: any
    onChange?: (e: React.ChangeEvent<HTMLDivElement>) => void
}

interface State {
    isActive: boolean
}

class Select extends React.Component {
    container: React.RefObject<HTMLDivElement>
    state: State

    constructor(public props: Props) {
        super(props)

        this.container = React.createRef()
        this.state = {
            isActive: false
        }
    }

    componentDidMount() {
        OutsideAlerter.addContainer(
            this.container.current as HTMLElement,
            () => this.toggleActive(false)
        )
    }

    componentWillUnmount() {
        OutsideAlerter.removeContainer(this.container.current as HTMLElement)
    }


    toggleActive(isActive?: boolean) {
        this.setState({
            isActive: isUndefined(isActive) ? !this.state.isActive : isActive
        })
    }

    render() {
        const classes = classNames(
            "l_select",
            (this.props.className || ""),
            {
                [StyleClass.Active]: this.state.isActive,
                "multiple": this.props.multiple
            }
        )

        return(
            <div
                className={classes}
                ref={this.container}
                onChange={this.props.onChange}
                onClick={() => { this.toggleActive() } }
            >
                <div>
                    {this.getOptions()}
                </div>
            </div>
        )
    }

    getOptions() {
        const optionType = this.props.multiple ? "checkbox" : "radio"
        return React.Children.map(this.props.children, (child, i) => {
            if(React.isValidElement<SelectOption>(child)) {
                const props: any = {
                    name: this.props.name,
                    type: optionType,
                    // Fix for child.props.props typings bug.
                    checked: this.isOptionChecked(this.props.children[i])
                }
                return React.cloneElement(child, props)
            }
        })
    }

    isOptionChecked(option: SelectOption): boolean {
        const selectValue = this.props.value || ""
        if(!selectValue)
            return false

        const optionValue = option.props.value || ""
        if(this.props.multiple)
            return selectValue.indexOf(optionValue) >= 0
        return selectValue === optionValue
    }
}


export default Select
