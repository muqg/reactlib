import { COLOR_DARK, styled } from "../../styles";
import { Size } from "../../utility";
import { AddButton } from "./AddButton";
import { ButtonVariant } from "./Button";

const CloseButton: typeof AddButton = styled(AddButton).attrs({
    color: COLOR_DARK,
    size: Size.Medium,
    variant: ButtonVariant.Text,
})`
    position: absolute;
    right: 5px;
    top: 5px;
    transform: rotate(45deg);
`
CloseButton.displayName = "CloseButton"


export { CloseButton };

