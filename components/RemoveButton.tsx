import { COLOR_DARK_RED, COLOR_RED, COLOR_WHITE, styled } from "../styles";
import { positionMixin } from "../styles/mixins";

const RemoveButton = styled.button`
    ${(_p: StyleProps) => ''}

    background: ${COLOR_RED};
    border-radius: 50%;
    box-sizing: border-box;
    cursor: pointer;
    height: ${p => p.size}px;
    ${positionMixin("relative")}
    width: ${p => p.size}px;

    &:hover {
        background: ${COLOR_DARK_RED}
    }

    &:before {
        background: ${COLOR_WHITE};
        content: '';
        height: 2px;
        transform: translate(-50%);
        width: calc(${p => p.size}px / 3 + 5px);
        ${positionMixin("absolute", "50%", "", "", "50%")}
    }
`
RemoveButton.defaultProps = {
    size: 22
}

interface StyleProps {
    size?: number
}


export { RemoveButton };

