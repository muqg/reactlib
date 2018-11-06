import { COLOR_DARK_GREEN, COLOR_GREEN, COLOR_WHITE, styled } from "../../styles";
import { position } from "../../styles/mixins";

const AddButton = styled.button`
    ${(_p: StyleProps) => ''}

    background: ${COLOR_GREEN};
    border-radius: 50%;
    box-sizing: border-box;
    cursor: pointer;
    height: ${p => p.size}px;
    width: ${p => p.size}px;
    ${position("relative")}

    &:hover {
        background: ${COLOR_DARK_GREEN}
    }

    &:before,
    &:after {
        background: ${COLOR_WHITE};
        content: '';
        height: 2px;
        transform: translate(-50%);
        width: calc(${p => p.size}px / 3 + 5px);
        ${position("absolute", "50%", "", "", "50%")}
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

