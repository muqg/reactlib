import {MouseEvent} from "react"
import {COLOR_DARK, COLOR_MAIN, css, styled} from "../../styles"

const withImage = css`
  background: url("${(p: Props) => p.backgroundImage}") no-repeat;
  background-size: auto 100%;
  filter: contrast(1);
  transition-property: filter;

  &:hover {
    filter: contrast(0);
  }
`
const withHover = css`
  &:hover {
    background: ${COLOR_DARK};
    color: ${COLOR_MAIN};
  }
`
const Container = styled.div`
  border-radius: 2px;
  color: ${COLOR_DARK};
  height: 100%;
  line-height: 24px;
  margin: 0 2px;
  min-width: 24px;
  transition-duration: 0.1s;
  transition-property: background, color, transform;

  ${(p: Props) => p.backgroundImage && withImage}

  ${(p) => p.animateHover && !p.backgroundImage && withHover}

    &:active {
    transform: translate(1px);
  }
`
Container.defaultProps = {
  animateHover: true,
}

interface Props {
  animateHover?: boolean
  backgroundImage?: string
  children?: any
  className?: string
  onClick?: (event: MouseEvent<HTMLDivElement>) => void
  title?: string
}

const ToolbarItem = (props: Props) => {
  return (
    <Container
      className={props.className}
      onClick={props.onClick}
      title={props.title}
      animateHover={props.animateHover}
      backgroundImage={props.backgroundImage}
    >
      {props.children}
    </Container>
  )
}

export {ToolbarItem}
