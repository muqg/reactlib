import * as React from "react";
import { css, styled, COLOR_PRIMARY_DARK } from "../styles";


const spanCommon = css`
    background: ${(p: StyleProps) => p.color};
    border-radius: 1px;
    content: '';
    display: block;
    height: 2px;
    position: absolute;
    transition: all .3s;
    width: inherit;
`

const activeStyle = css`
    > span {
        background: transparent !important;

        &:before {
            top: 0;
            transform: rotate(45deg);
        }

        &:after {
            top: 0;
            transform: rotate(-45deg);
        }
    }
`

const Button = styled.button`
    cursor: pointer;
    height: ${(p: StyleProps) => p.size}px;
    width: ${(p: StyleProps) => p.size}px;

    > span {
        ${spanCommon}

        &:before {
            ${spanCommon}
            top: -10px;
        }

        &:after {
            ${spanCommon}
            top: 10px;
        }
    }

    ${p => p.active && activeStyle}
`
Button.defaultProps = {
    color: COLOR_PRIMARY_DARK,
    size: 30
}



interface StyleProps {
    color?: string
    /**
     * Sandwich button's size in pixels. This accounts for both width and height.
     */
    size?: number
    active?: boolean
}

interface OwnProps {
    className?: string
    onClick?: (isActive: boolean, e: React.MouseEvent<any>) => void
}

interface State {
    active: boolean
}
type Props = OwnProps & StyleProps


class SandwichButton extends React.PureComponent<Props, State> {
    state = {
        active: false
    }

    handleClick = (event: React.MouseEvent<any>) => {
        const active = !this.state.active
        this.setState(prevState => {
            return {active: !prevState.active}
        })

        if(this.props.onClick)
            this.props.onClick(active, event)
    }

    render() {
        return (
            <div className={this.props.className}>
                <Button
                    color={this.props.color}
                    onClick={this.handleClick}
                    size={this.props.size}
                >
                    <span></span>
                </Button>
            </div>
        )
    }
}


export default SandwichButton
