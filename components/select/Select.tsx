import * as React from "react";
import { StyleClass } from "../../utility/enums";
import { OutsideAlerter, classNames } from "../../utility/dom";
import { SelectOption } from ".";
import { isUndefined } from "../../utility/assertions";

interface Props {
    className?: string
    children?: SelectOption[]
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
            this.props.className,
            { [StyleClass.Active]: this.state.isActive }
        )

        return(
            <div
                className={classes}
                ref={this.container}
                onChange={this.props.onChange}
                onClick={() => this.toggleActive()}
            >
                <div>
                    {this.props.children}
                </div>
            </div>
        )
    }
}


export default Select
