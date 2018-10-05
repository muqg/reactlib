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



interface StyleProps {
    color: string
    /**
     * Sandwich button's size in pixels. This accounts for both width and height.
     */
    size: number
    /**
     * Whether it is initially active or not.
     */
    active: boolean
}

interface OwnProps {
    className?: string
    /**
     * Called when the button is clicked and its active state changes.
     */
    onClick?: (isActive: boolean, e: React.MouseEvent<any>) => void
}

interface State {
    active: boolean
}
type Props = OwnProps & StyleProps


class SandwichButton extends React.PureComponent<Props, State> {
    static defaultProps = {
        active: false,
        color: COLOR_PRIMARY_DARK,
        size: 30
    }

    state: State = {
        active: this.props.active
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        if(this.props.active !== prevProps.active && this.props.active !== prevState.active)
            this.setState({active: this.props.active})
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
                    active={this.state.active}
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
