import { styled } from "../../styles";
import { Size } from "../../utility";
import { Button, ButtonDefaultProps } from "./Button";

const FONT_DOWNSIZE_FACTOR = 4

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
    /* Size will not be undefined due to DefaultProps */
    font-size: ${p => getIconButtonDiameter(p) - (p.size! * FONT_DOWNSIZE_FACTOR)}px;
    height: ${getIconButtonDiameter}px;
    line-height: ${getIconButtonDiameter}px;
    padding: 0;
    width: ${getIconButtonDiameter}px;
`
IconButton.defaultProps = {
    ...ButtonDefaultProps,
    size: Size.Small
}
IconButton.displayName = "IconButton"


export { IconButton };

