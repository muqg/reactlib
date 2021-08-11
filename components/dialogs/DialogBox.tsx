import {ComponentType} from "react"
import {COLOR_BACKGROUND, COLOR_DARK, css, styled} from "../../styles"
import {Size} from "../../utility"
import {isFunction} from "../../utility/assertions"
import {CloseButton} from "../buttons"
import {DialogBoxProps, DialogProps} from "../component-types"
import {DocumentTitle} from "../DocumentTitle"
import {Grid} from "../Grid"
import {View} from "../View"
import {Dialog} from "./Dialog"

const SIZE_FACTOR = 320

const Back = styled.div`
  background: black;
  bottom: 0;
  left: 0;
  opacity: 0.6;
  position: absolute;
  right: 0;
  top: 0;
  z-index: -1;
`
const Header = styled(Grid)`
  border-bottom: 1px solid;
  border-image: linear-gradient(
      to right,
      transparent,
      ${(p) => p.theme.main || COLOR_DARK},
      transparent
    )
    1;
  padding: 3px 12px;
`
const Title = styled.p`
  font-size: 1.1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  white-space: nowrap;
`
const Container = styled(Grid)`
  background: ${(p) => p.theme.background || COLOR_BACKGROUND};
  max-width: ${(p) => p.size * SIZE_FACTOR}px;

  ${(p: ContainerStyleProps) =>
    p.fixedHeight
      ? css`
          height: 90vh;
        `
      : css`
          max-height: 90vh;
        `}
`

interface ContainerStyleProps {
  /**
   * Whether height should adjust based on content or
   * always be at its maximum.
   */
  fixedHeight?: boolean
  size: Size
}

type Props = DialogBoxProps & DialogProps

const DialogBox: ComponentType<Props> = ({
  children,
  className,
  fixedHeight,
  size = Size.Small,
  title,
  ...props
}) => {
  return (
    <Dialog {...props}>
      {(close) => (
        <>
          {title && <DocumentTitle title={title} />}
          <Back onClick={close} />
          <Container
            className={className}
            direction="column"
            fixedHeight={fixedHeight}
            size={size}
          >
            <Header verticalAlign="center">
              <Title>{title}</Title>
              {/* Close button becomes deformed due to flex parent without this wrapper. */}
              <div>
                <CloseButton onClick={close} />
              </div>
            </Header>
            <View fullHeight>
              {isFunction<Dialog["children"]>(children)
                ? children(close)
                : children}
            </View>
          </Container>
        </>
      )}
    </Dialog>
  )
}

export {DialogBox}
