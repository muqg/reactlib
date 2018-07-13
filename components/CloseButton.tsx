import * as React from "react";
import { css, styled } from "../styles";
import { COLOR_PRIMARY_DARK } from "../styles/colours";
import { PositionStyle } from "../styles/types";
import { positionMixin } from "../styles/mixins";


const spanCommon = css`
    background: ${(p: StyleProps) => p.color};
    border-radius: 1px;
    content: '';
    display: block;
    height: 2px;
    position: absolute;
    width: inherit;
`

const StyledButton = styled.button`
    cursor: pointer;
    height: ${(p: StyleProps) => p.size}px;
    position: absolute;
    width: ${p => p.size}px;

    ${p => positionMixin(p)}

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
    right: "0",
    top: "0",
}


interface StyleProps extends PositionStyle {
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

export default CloseButton
