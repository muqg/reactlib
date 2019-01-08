import { styled } from "../../styles";
import { Size } from "../../utility";
import { Button, ButtonDefaultProps } from "./Button";

interface StyleProps {
    size?: Size
}

export function getIconButtonDiameter(p: StyleProps) {
    // Default props will inject the default size
    // value and it will never be undefined.
    return (p.size || Size.Small) * 16
}

const IconButton = styled(Button)`
    ${(_p: StyleProps) => ""}

    border-radius: 50%;
    height: ${getIconButtonDiameter}px;
    padding: 0;
    width: ${getIconButtonDiameter}px;
`
IconButton.defaultProps = ButtonDefaultProps


export { IconButton };

