import { COLOR_MAIN, css, styled } from "../../styles";
import { Size } from "../../utility";

interface StyleProps {
    color?: string
    hoverEffect?: boolean
    size?: Size
}

// Default props will inject the default size
// value and it will never be undefined.
function sizeValue(p: Required<StyleProps>) {
    return p.size * 16
}

const IconButton = styled.button`
    ${(_p: StyleProps) => ""}

    background: ${p => p.color};
    border: 1px solid transparent;
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    font-size: ${sizeValue}px;
    height: ${sizeValue}px;
    line-height: ${sizeValue}px;
    text-align: center;
    transition: all .15s ease;
    width: ${sizeValue}px;

    ${p => p.hoverEffect && css`
        &:hover {
            background: #fff;
            border-color: ${p => p.color};
            box-shadow: inset 0 0 ${p => sizeValue(p) / 7}px;
            color: ${p => p.color};
        }
    `}
`
IconButton.defaultProps = {
    color: COLOR_MAIN,
    hoverEffect: true,
    size: Size.Small
}


export { IconButton };

