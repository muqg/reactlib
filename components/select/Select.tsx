import * as React from "react";
import { COLOR_PRIMARY_DARK, COLOR_WHITE, css, styled } from "../../styles";
import { OutsideAlerter } from "../../utility/dom";
import SelectOption from "./SelectOption";

const DEFAULT_HEIGHT = 25

const divCommon = css`
    background: ${COLOR_WHITE};
    border: 1px solid #dedede;
    color: ${COLOR_PRIMARY_DARK};
    cursor: pointer;
    height: 100%;
    outline: none;
    overflow: hidden;
    position: ${p => p.multiple ? "relative" : "absolute"};
    width: 100%;
    z-index: ${p => p.active ? 3 : 2};

    ${(p: StyleProps) => (p.multiple || p.active) && css`
        height: auto;
        max-height: 165px; /* Determines dropped height */
        overflow-y: auto;
    `}
`
const Container = styled.div`
    display: inline-block;
    height: ${(p: StyleProps) => p.active ? "auto" : p.height + "px"};
    position: relative;
    vertical-align: middle;
    width: 250px;

    > div {
        ${divCommon}
    }
`
Container.defaultProps = {
    height: DEFAULT_HEIGHT
}

interface StyleProps {
    active?: boolean
    height?: number
    multiple?: boolean
}
interface Props {
    name: string
    height?: number
    /**
     * Value of checked option or options if select is multiple.
     */
    value?: string
    /**
     * Whether select is a multiple choice.
     */
    multiple?: boolean
    /**
     * Provided for styled components extensibility.
     */
    className?: string
    children?: any
    onChange?: (e: React.ChangeEvent<any>) => void
}

interface State {
    isActive: boolean
}


class Select extends React.Component<Props, State> {
    static optionID = 420

    state: State = {
        isActive: false
    }
    container = React.createRef<HTMLDivElement>()

    componentDidMount() {
        if(!this.props.multiple) {
            OutsideAlerter.addContainer(
                this.container.current as HTMLElement,
                () => this.toggleActive(false)
            )
        }
    }

    componentWillUnmount() {
        if(!this.props.multiple) {
            OutsideAlerter.removeContainer(this.container.current as HTMLElement)
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
                const node = this.container.current as HTMLElement
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
        return(
            <Container
                data-name={this.props.name}
                // Pass l_select class since it is used by model.
                className={this.props.className + " " + "l_select"}
                innerRef={this.container}
                onChange={this.props.onChange}

                active={this.state.isActive}
                height={this.props.height}
                multiple={this.props.multiple}
            >
                <div>
                    {this.getOptions()}
                </div>
            </Container>
        )
    }

    getOptions() {
        const optionType = this.props.multiple ? "checkbox" : "radio"
        Select.optionID++

        return React.Children.map(this.props.children, (child, i) => {
            if(React.isValidElement<SelectOption>(child)) {
                const props: any = {
                    name: Select.optionID,
                    type: optionType,
                    selected: this.isOptionSelected(child, i),
                    onClick: () => this.toggleActive(!this.state.isActive),

                    active: this.state.isActive,
                    height: this.props.height || DEFAULT_HEIGHT,
                    multiple: this.props.multiple,
                }
                return React.cloneElement(child, props)
            }
        })
    }

    isOptionSelected(option: React.ReactElement<SelectOption>, index: number): boolean {
        const selectValues = (this.props.value || "").split(",")
        // @ts-ignore Strange option.props.props typings bug.
        const optionValue = option.props.value

        if(this.props.multiple)
            return selectValues.indexOf(optionValue) >= 0
        // Always mark first option as selected for single selects by default.
        return index === 0 || selectValues[0] === optionValue
    }
}


export default Select
