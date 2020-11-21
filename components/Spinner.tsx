import spinnerImage from "../img/tail-spinner.svg"
import {styled} from "../styles"
import {Size} from "../utility"

const SIZE_FACTOR = 24

const StyledImage = styled.img`
  ${(_p: StyleProps) => ""}

  display: block;
  height: ${(p) => p.size! * SIZE_FACTOR}px;
  margin: auto;
  width: ${(p) => p.size! * SIZE_FACTOR}px;

  ${(p) => p.visible !== undefined && !p.visible && `visibility: hidden;`}
`
StyledImage.defaultProps = {
  size: Size.Large,
}

interface StyleProps {
  size?: Size
  visible?: boolean
}

interface Props extends StyleProps {
  className?: string
}

export const Spinner = (props: Props) => {
  return <StyledImage {...props} src={spinnerImage} />
}
