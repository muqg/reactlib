import { styled } from "../../styles";
import { Size } from "../../utility";
import { Button, ButtonDefaultProps, ButtonStyleProps } from "./Button";

const FONT_DOWNSIZE_FACTOR = 4

export interface IconButtonStyleProps extends ButtonStyleProps {
    size?: Size
}

function getDiameter(p: IconButtonStyleProps) {
    // Default props will inject the default size
    // value and it will never be undefined.
    return (p.size || Size.Small) * 16
}

const IconButton = styled(Button)`
    ${(_p: IconButtonStyleProps) => ""}

    align-items: center;
    border-radius: 50%;
    border-width: ${p => p.size}px;
    box-sizing: content-box;
    display: flex;
    /* Size will not be undefined due to DefaultProps */
    font-size: ${p => getDiameter(p) - (p.size! * FONT_DOWNSIZE_FACTOR)}px;
    height: ${getDiameter}px;
    justify-content: center;
    line-height: ${getDiameter}px;
    padding: 0;
    width: ${getDiameter}px;
`
IconButton.defaultProps = {
    ...ButtonDefaultProps,
    size: Size.Medium
}
IconButton.displayName = "IconButton"


export { IconButton };

