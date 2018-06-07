import * as React from "react";
import { isUndefined } from "../../utility/assertions";
import { classNames, OutsideAlerter } from "../../utility/dom";
import { StyleClass } from "../../utility/enums";

interface Props {
    name: string
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
        const optionType = this.props.multiple ? "checkbox" : "radio"
        const childOptions = React.Children.map(this.props.children, (child) => {
            if(React.isValidElement(child)) {
                const props: any = {
                    name: this.props.name,
                    type: optionType
                }
                return React.cloneElement(child, props)
            }
        })

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
                onClick={() => this.toggleActive()}
            >
                <div>
                    {childOptions}
                </div>
            </div>
        )
    }
}


export default Select
