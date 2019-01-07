import { COLOR_ERROR, COLOR_BACKGROUND, styled } from "../../styles";
import { position } from "../../styles/mixins";

const RemoveButton = styled.button`
    ${(_p: StyleProps) => ''}

    background: ${COLOR_ERROR};
    border-radius: 50%;
    box-sizing: border-box;
    cursor: pointer;
    height: ${p => p.size}px;
    ${position("relative")}
    width: ${p => p.size}px;

    &:hover {
        background: #cc0000;
    }

    &:before {
        background: ${COLOR_BACKGROUND};
        content: '';
        height: 2px;
        transform: translate(-50%);
        width: calc(${p => p.size}px / 3 + 5px);
        ${position("absolute", "50%", "", "", "50%")}
    }
`
RemoveButton.defaultProps = {
    size: 22
}

interface StyleProps {
    size?: number
}


export { RemoveButton };

