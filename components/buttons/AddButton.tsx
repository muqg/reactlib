import {ComponentProps, ComponentType} from "react"
import {COLOR_SUCCESS, useTheme} from "../../styles"
import {Size} from "../../utility"
import {IconButton} from "./IconButton"

type Props = Omit<ComponentProps<typeof IconButton>, "children">

const AddButton: ComponentType<Props> = ({color, ...props}) => {
  const theme = useTheme()
  color = color || theme.success || COLOR_SUCCESS

  const stroke = props.size && props.size > Size.Medium ? props.size : 2

  return (
    <IconButton {...props} color={color}>
      <svg height="50%" strokeWidth={stroke} width="50%">
        <line x1="0" x2="100%" y1="50%" y2="50%" />
        <line x1="50%" x2="50%" y1="0" y2="100%" />
      </svg>
    </IconButton>
  )
}

export {AddButton}
