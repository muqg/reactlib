import { COLOR_DARK, styled, css } from "../../styles";
import { Size } from "../../utility";
import { AddButton } from "./AddButton";
import { ButtonVariant } from "./Button";

type CloseButtonType = React.ComponentType<React.ComponentProps<typeof AddButton> & StyleProps>

interface StyleProps {
    /**
     * Enables default absolute position
     * styling of the close button.
     */
    absolute?: boolean
}

const absoluteStyling = css`
    position: absolute;
    right: 6px;
    top: 6px;
    z-index: 1;
`

const CloseButton: CloseButtonType = styled(AddButton).attrs({
    color: COLOR_DARK,
    size: Size.Medium,
    variant: ButtonVariant.Text,
})`
    transform: rotate(45deg);

    ${(p: StyleProps) => p.absolute && absoluteStyling}
`
CloseButton.displayName = "CloseButton"


export { CloseButton };

