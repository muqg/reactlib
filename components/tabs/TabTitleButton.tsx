import {ReactNode} from "react"
import {styled} from "../../styles"
import {Button, ButtonVariant} from "../buttons"

const StyledButton = styled(Button)`
  border-radius: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 150px;
  white-space: nowrap;
`

interface Props {
  active?: boolean
  children: ReactNode
  index: number
  onClick: (index: number) => void
}

const TabTitleButton = (props: Props) => {
  return (
    <StyledButton
      hover={!props.active}
      onClick={() => props.onClick(props.index)}
      variant={props.active ? ButtonVariant.Normal : ButtonVariant.Outlined}
    >
      {props.children}
    </StyledButton>
  )
}

export {TabTitleButton}
