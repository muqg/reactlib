import * as React from "react";
import "../../css/select.css";
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
    onChange?: (e: React.ChangeEvent<any>) => void
}

interface State {
    isActive: boolean
}

class Select extends React.Component {
    containerRef: React.RefObject<HTMLDivElement>
    state: State

    constructor(public props: Props) {
        super(props)

        this.containerRef = React.createRef()
        this.state = {
            isActive: false
        }
    }

    componentDidMount() {
        if(!this.props.multiple) {
            OutsideAlerter.addContainer(
                this.containerRef.current as HTMLElement,
                () => this.toggleActive(false)
            )
        }
    }

    componentWillUnmount() {
        if(!this.props.multiple) {
            OutsideAlerter.removeContainer(this.containerRef.current as HTMLElement)
        }
    }

    toggleActive(isActive: boolean) {
        if(this.props.multiple)
            return

        this.setState({
            isActive: isActive
        },
        () => {
            // Scroll to currently seletected element if active.
            if(this.state.isActive) {
                const node = this.containerRef.current as HTMLElement
                const selectedInput = node.querySelector<HTMLInputElement>("input:checked")

                // Should null check in case that there is no initially checked element.
                if(selectedInput) {
                    const selectedLabel = selectedInput.parentElement as HTMLElement
                    const optionsDivContainer = selectedLabel.parentElement as HTMLElement
                    optionsDivContainer.scrollTop = selectedLabel.offsetTop - selectedLabel.offsetHeight
                }
            }
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
                ref={this.containerRef}
                onChange={this.props.onChange}
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
                    checked: this.isOptionChecked(this.props.children[i], i),
                    onClick: () => { this.toggleActive(!this.state.isActive) }
                }
                return React.cloneElement(child, props)
            }
        })
    }

    isOptionChecked(option: SelectOption, index: number): boolean {
        const selectValues = (this.props.value || "").split(",")
        if(!selectValues)
            return false

        const optionValue = option.props.value || ""
        if(this.props.multiple)
            return selectValues.indexOf(optionValue) >= 0
        // Always check first element for single selects.
        return index === 0 || selectValues[0] === optionValue
    }
}


export default Select
