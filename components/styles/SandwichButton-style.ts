import { css, styled } from "../../styles";

const spanCommon = css`
    background: #fff;
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

export interface SandwichButtonStyleProps {
    size?: number
    active?: boolean
}

const StyledSandwichButton = styled.div`
    cursor: pointer;
    height: ${(p: SandwichButtonStyleProps) => p.size}px;
    width: ${(p: SandwichButtonStyleProps) => p.size}px;

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

StyledSandwichButton.defaultProps = {
    size: 30
}

export { StyledSandwichButton };
