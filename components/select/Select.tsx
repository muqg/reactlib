import * as React from "react";
import "../../css/select.css";
import { isUndefined } from "../../utility/assertions";
import { classNames, OutsideAlerter } from "../../utility/dom";
import { StyleClass } from "../../utility/enums";
import SelectOption from "./SelectOption";

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
    isMultiple: boolean
    state: State

    constructor(public props: Props) {
        super(props)

        this.container = React.createRef()
        this.state = {
            isActive: false
        }
        this.isMultiple = this.props.multiple || false
    }

    componentDidMount() {
        if(!this.isMultiple) {
            OutsideAlerter.addContainer(
                this.container.current as HTMLElement,
                () => this.toggleActive(false)
            )
        }
    }

    componentWillUnmount() {
        if(!this.isMultiple) {
            OutsideAlerter.removeContainer(this.container.current as HTMLElement)
        }
    }


    toggleActive(isActive?: boolean) {
        if(!this.isMultiple) {
            this.setState({
                isActive: isUndefined(isActive) ? !this.state.isActive : isActive
            })
        }
    }

    render() {
        const classes = classNames(
            "l_select",
            (this.props.className || ""),
            {
                [StyleClass.Active]: this.state.isActive,
                "multiple": this.isMultiple
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
        const optionType = this.isMultiple ? "checkbox" : "radio"
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
        if(this.isMultiple)
            return selectValue.indexOf(optionValue) >= 0
        return selectValue === optionValue
    }
}


export default Select
