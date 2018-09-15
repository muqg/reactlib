import { COLOR_DARK_GREEN, COLOR_GREEN, COLOR_WHITE, styled } from "../styles";

const AddButton = styled.button`
    ${(_p: StyleProps) => ''}

    background: ${COLOR_GREEN};
    border-radius: 50%;
    box-sizing: border-box;
    cursor: pointer;
    height: ${p => p.size}px;
    position: relative;
    width: ${p => p.size}px;

    &:hover {
        background: ${COLOR_DARK_GREEN}
    }

    &:before,
    &:after {
        background: ${COLOR_WHITE};
        content: '';
        height: 2px;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%);
        width: calc(${p => p.size}px / 3 + 5px);
    }

    &:after {
        transform: translate(-50%) rotate(90deg);
    }
`
AddButton.defaultProps = {
    size: 22
}

interface StyleProps {
    size?: number
}


export { AddButton };
