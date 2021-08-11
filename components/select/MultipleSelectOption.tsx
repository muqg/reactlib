import {COLOR_MAIN, css, styled} from "../../styles"

const Container = styled.label`
  border-bottom: 1px solid transparent;
  cursor: pointer;
  display: block;
  /* Should be equal to .l_select height */
  line-height: ${(p: StyleProps) => p.height}px;
  margin: 0;
  padding: 0 3px;
  position: relative;
  transition: background 0.3s ease;

  ${(p) =>
    p.active &&
    css`
      display: block;
      &:hover {
        background: #efefef;
      }
    `}

  input {
    display: none;
  }
`
const contentCommon = css`
  display: block;
  left: 0;
  position: relative;
  top: 0;
  width: 100%;

  &:hover {
    background: #efefef;
  }
`
const Content = styled.div`
  display: ${(p: StyleProps) => (p.active || p.multiple ? "block" : "none")};
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  input:checked ~ & {
    ${(p) => !p.active && contentCommon}

    ${(p) =>
      (p.active || p.multiple) &&
      css`
        background: #f7f7f7;
        border-bottom-color: ${COLOR_MAIN};
        color: #dbaa6b;
      `}
  }
`

interface StyleProps {
  active?: boolean
  height?: number
  multiple?: boolean
}

interface Props {
  children?: any
  className?: string
  value?: string

  /**
   * Attribute is passed internally by parent Select based on its provided value.
   * This attribute may also be set on individual SelectOptions but will be
   * overrriden in case of conflict with Select's value attribute.
   */
  selected?: boolean

  /**
   * Property is passed internally by parent Select.
   */
  name?: string
  /**
   * Property is passed internally by parent Select.
   */
  type?: "checkbox" | "radio"
  /**
   * Property is passed internally by parent Select.
   */
  onClick?: () => void
}

function MultipleSelectOption(props: Props & StyleProps) {
  return (
    <Container
      active={props.active}
      height={props.height}
      multiple={props.multiple}
    >
      <input
        checked={props.selected}
        type={props.type}
        name={props.name}
        value={props.value}
        onClick={props.onClick}
      />
      <Content
        active={props.active}
        className={props.className}
        height={props.height}
        multiple={props.multiple}
      >
        {props.children || props.value}
      </Content>
    </Container>
  )
}

export default MultipleSelectOption
