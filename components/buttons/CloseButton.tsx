import {ComponentType, ComponentProps} from "react"
import {COLOR_DARK, css, styled} from "../../styles"
import {Size} from "../../utility"
import {AddButton} from "./AddButton"
import {ButtonVariant} from "./Button"
import {IconButtonStyleProps} from "./IconButton"

type CloseButtonType = ComponentType<
  ComponentProps<typeof AddButton> & StyleProps
>

interface StyleProps extends IconButtonStyleProps {
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

const CloseButton = styled(AddButton).attrs<StyleProps, StyleProps>((p) => ({
  color: p.theme.main || COLOR_DARK,
  size: Size.Medium,
  variant: ButtonVariant.Text,
}))`
  transform: rotate(45deg);

  ${(p: StyleProps) => p.absolute && absoluteStyling}
` as CloseButtonType
CloseButton.displayName = "CloseButton"

export {CloseButton}
