import { COLOR_RED, COLOR_WHITE, styled, COLOR_DARK_RED } from "../styles";

const RemoveButton = styled.button`
    ${(_p: StyleProps) => ''}

    background: ${COLOR_RED};
    border-radius: 50%;
    box-sizing: border-box;
    cursor: pointer;
    height: ${p => p.size}px;
    position: relative;
    width: ${p => p.size}px;

    &:hover {
        background: ${COLOR_DARK_RED}
    }

    &:before {
        background: ${COLOR_WHITE};
        content: '';
        height: 2px;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%);
        width: calc(${p => p.size}px / 3 + 5px);
    }
`
RemoveButton.defaultProps = {
    size: 22
}

interface StyleProps {
    size?: number
}


export { RemoveButton };
