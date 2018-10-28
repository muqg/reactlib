import * as React from "react";
import { COLOR_PRIMARY_LIGHT, COLOR_SECONDARY_LIGHT, css, styled } from "../../styles";
import { positionMixin, truncateMixin } from "../../styles/mixins";


const Container = styled.label`
    border-bottom: 1px solid transparent;
    cursor: pointer;
    display: block;
    /* Should be equal to .l_select height */
    line-height: ${(p: StyleProps) => p.height}px;
    margin: 0;
    padding: 0 3px;
    ${positionMixin("relative")}
    transition: background .3s ease;

    ${p => p.active && css`
        display: block;
        &:hover {
            background: ${COLOR_SECONDARY_LIGHT}
        }
    `}

    input {
        display: none;
    }
`
const contentCommon = css`
    display: block;
    width: 100%;
    ${positionMixin("relative", "0", null, null, "0")}

    &:hover {
        background: ${COLOR_SECONDARY_LIGHT}
    }
`
const Content = styled.div`
    box-sizing: border-box;
    display: ${(p: StyleProps) => (p.active || p.multiple) ? "block" : "none"};
    height: 100%;
    ${truncateMixin()}

    input:checked ~ & {
        ${p => !p.active && contentCommon}

        ${p => (p.active || p.multiple) && css`
            background: #f7f7f7;
            border-bottom-color: ${COLOR_PRIMARY_LIGHT};
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


class MultipleSelectOption extends React.PureComponent<Props & StyleProps> {
    render() {
        return (
            <Container
                active={this.props.active}
                height={this.props.height}
                multiple={this.props.multiple}
            >
                <input
                    checked={this.props.selected}
                    type={this.props.type}
                    name={this.props.name}
                    value={this.props.value}
                    onClick={this.props.onClick}
                />
                <Content
                    active={this.props.active}
                    className={this.props.className}
                    height={this.props.height}
                    multiple={this.props.multiple}
                >
                    {this.props.children || this.props.value}
                </Content>
            </Container>
        )
    }
}


export default MultipleSelectOption
