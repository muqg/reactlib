import {
  ChangeEvent,
  Children,
  cloneElement,
  Component,
  createRef,
  isValidElement,
  ReactElement,
} from "react"
import {COLOR_BACKGROUND, COLOR_DARK, css, styled} from "../../styles"
import {position} from "../../styles/mixins"
import {classNames} from "../../utility/dom"
import {OutsideAlert} from "../OutsideAlert"
import SelectOption from "./SelectOption"

const DEFAULT_HEIGHT = 25

const divCommon = css`
  background: ${COLOR_BACKGROUND};
  border: 1px solid #dedede;
  color: ${COLOR_DARK};
  cursor: pointer;
  height: 100%;
  outline: none;
  overflow: hidden;
  position: ${(p) => (p.multiple ? "relative" : "absolute")};
  width: 100%;
  z-index: ${(p) => (p.active ? 3 : 2)};

  ${(p: StyleProps) =>
    (p.multiple || p.active) &&
    css`
      height: auto;
      max-height: 165px; /* Determines dropped height */
      overflow-y: auto;
    `}
`
const Container = styled.div`
  display: inline-block;
  height: ${(p: StyleProps) => (p.active ? "auto" : p.height + "px")};
  ${position("relative")}
  vertical-align: middle;
  width: 250px;

  > div {
    ${divCommon}
  }
`
Container.defaultProps = {
  height: DEFAULT_HEIGHT,
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
  onChange?: (e: ChangeEvent<any>) => void
}

interface State {
  isActive: boolean
}

class Select extends Component<Props, State> {
  static optionID = 420

  state: State = {
    isActive: false,
  }
  container = createRef<any>()

  toggleActive(isActive: boolean) {
    if (this.props.multiple) return

    this.setState(
      {
        isActive,
      },
      () => {
        // Scroll to currently seletected element if active.
        if (this.state.isActive) {
          const node = this.container.current as HTMLElement
          const selectedInput = node.querySelector<HTMLInputElement>(
            "input:checked"
          )

          // Should null check in case that there is no initially checked element.
          if (selectedInput) {
            const selectedLabel = selectedInput.parentElement as HTMLElement
            const optionsDivContainer = selectedLabel.parentElement as HTMLElement
            optionsDivContainer.scrollTop =
              selectedLabel.offsetTop - selectedLabel.offsetHeight
          }
        }
      }
    )
  }

  render() {
    // Pass l_select and multiple class since it is used by model.
    const classes = classNames(this.props.className, "l_select", {
      multiple: this.props.multiple,
    })

    return (
      <OutsideAlert
        container={this.container.current}
        enabled={!this.props.multiple && this.state.isActive}
        trigger={() => this.toggleActive(false)}
      >
        <Container
          data-name={this.props.name}
          className={classes}
          ref={this.container}
          onChange={this.props.onChange}
          active={this.state.isActive}
          height={this.props.height}
          multiple={this.props.multiple}
        >
          <div>{this.getOptions()}</div>
        </Container>
      </OutsideAlert>
    )
  }

  getOptions() {
    const optionType = this.props.multiple ? "checkbox" : "radio"
    Select.optionID++

    return Children.map(this.props.children, (child, i) => {
      if (isValidElement<SelectOption>(child)) {
        const props: any = {
          name: Select.optionID,
          type: optionType,
          selected: this.isOptionSelected(child, i),
          onClick: () => this.toggleActive(!this.state.isActive),

          active: this.state.isActive,
          height: this.props.height || DEFAULT_HEIGHT,
          multiple: this.props.multiple,
        }
        return cloneElement(child, {...child.props, ...props})
      }
    })
  }

  isOptionSelected(option: ReactElement<SelectOption>, index: number): boolean {
    const selectValues = (this.props.value || "").split(",")
    // @ts-ignore Strange option.props.props typings bug.
    const optionValue = option.props.value

    if (this.props.multiple) return selectValues.indexOf(optionValue) >= 0
    // Always mark first option as selected for single selects by default.
    return index === 0 || selectValues[0] === optionValue
  }
}

export default Select
