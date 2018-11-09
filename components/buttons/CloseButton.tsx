import * as React from "react";
import { css, styled } from "../../styles";
import { COLOR_PRIMARY_DARK } from "../../styles/colours";
import { position } from "../../styles/mixins";


const spanCommon = css`
    background: ${(p: StyleProps) => p.color};
    border-radius: 1px;
    content: '';
    display: block;
    height: 2px;
    width: inherit;
    z-index: 1;
    ${position("absolute")}
`

const StyledButton = styled.button`
    cursor: pointer;
    height: ${(p: StyleProps) => p.size}px;
    width: ${p => p.size}px;
    ${p => position("absolute", p.top, p.right, p.bottom, p.left)}

    > span {
        ${spanCommon}
        background: transparent;

        &:before {
            ${spanCommon}
            transform: rotate(45deg);
        }

        &:after {
            ${spanCommon}
            transform: rotate(-45deg);
        }
    }
`
StyledButton.defaultProps = {
    color: COLOR_PRIMARY_DARK,
    size: 30,
    right: "5px",
    top: "5px",
}


interface StyleProps {
    bottom?: string
    left?: string
    right?: string
    top?: string

    /**
     * Close button's size in pixels. This accounts for both width and height.
     */
    size?: number

    color?: string
}

interface Props {
    className?: string
    onClick: (e: React.MouseEvent<any>) => void
}

const CloseButton = (props: Props & StyleProps) => {
    return (
        <StyledButton
            {...props}
            type="button"
        >
            <span></span>
        </StyledButton>
    )
}

export { CloseButton };

