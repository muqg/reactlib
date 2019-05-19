import * as React from "react"
import {styled} from "../styles"
import {Size} from "../utility"

const MARGIN_SIZE_FACTOR = 12

const Container = styled.div`
  margin: ${(p: StyleProps) => p.margin! * MARGIN_SIZE_FACTOR}px 0;
  max-width: inherit;
  position: relative;
`
Container.defaultProps = {
  margin: Size.Small,
}

const Title = styled.h4`
  padding: 4px 0;
`

interface StyleProps {
  margin?: Size
}

type Props = React.ComponentProps<typeof Container>

const Block = ({children, title, ...props}: Props) => {
  return (
    <Container {...props}>
      {title && <Title>{title}</Title>}
      {children}
    </Container>
  )
}

export {Block}
