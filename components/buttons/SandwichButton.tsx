import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { COLOR_DARK, css, styled, ThemeContext } from "../../styles";
import { call } from "../../utility/function";


const spanCommon = css`
    background: ${(p: StyleProps) => p.color};
    border-radius: 1px;
    content: '';
    display: inline-block;
    height: 2px;
    left: 0;
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
const StyledButton = styled.button`
    cursor: pointer;
    height: ${(p: StyleProps) => p.size}px;
    position: relative;
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

type Props = OwnProps & StyleProps


function SandwichButton({active = false, color, size = 30, ...props}: Props) {
    const theme = useContext(ThemeContext)
    color = color || theme.main || COLOR_DARK

    const [isActive, setIsActive] = useState(active)
    useEffect(() => {
        // Avoids some unnecessary renders and possible infinite loops.
        if(active !== isActive)
            setIsActive(active)
    }, [active])

    function handleClick(event: React.MouseEvent<any>) {
        const nextIsActive = !isActive
        setIsActive(nextIsActive)

        call(props.onClick, nextIsActive, event)
    }

    return (
        <StyledButton
            active={isActive}
            className={props.className}
            color={color}
            onClick={handleClick}
            size={size}
        >
            <span></span>
        </StyledButton>
    )
}


export { SandwichButton };

