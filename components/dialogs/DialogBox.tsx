import * as React from "react"
import {COLOR_BACKGROUND, COLOR_DARK, css, styled} from "../../styles"
import {truncate} from "../../styles/mixins"
import {Size} from "../../utility"
import {isFunction} from "../../utility/assertions"
import {CloseButton} from "../buttons"
import {DocumentTitle} from "../DocumentTitle"
import {Dialog, DialogProps} from "./Dialog"

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
const Header = styled.div`
  align-items: center;
  border-bottom: 1px solid;
  border-image: linear-gradient(
      to right,
      transparent,
      ${p => p.theme.main || COLOR_DARK},
      transparent
    )
    1;
  display: flex;
  padding: 3px 12px;
`
const Title = styled.p`
  font-size: 1.1rem;
  ${truncate("100%")}
`
const Container = styled.div`
    ${(_p: ContainerStyleProps) => ""}

    background: ${p => p.theme.background || COLOR_BACKGROUND};
    display: flex;
    flex-direction: column;
    max-width: ${p => p.size * SIZE_FACTOR}px;
    width: 100%;

    ${p =>
      p.fixedHeight
        ? css`
            height: 90vh;
          `
        : css`
            max-height: 90vh;
          `}
`
const Content = styled.div`
  height: 100%;
  overflow: auto;
`

interface ContainerStyleProps {
  /**
   * Whether height should adjust based on content or
   * always be at its maximum.
   */
  fixedHeight?: boolean
  size: Size
}

export interface DialogBoxProps extends Partial<ContainerStyleProps> {
  children: React.ReactNode | Dialog["children"]
  /**
   * Dialog's title.
   */
  title?: string
}

type Props = DialogBoxProps & DialogProps

const DialogBox: React.ComponentType<Props> = ({
  children,
  className,
  fixedHeight,
  size = Size.Small,
  title,
  ...props
}) => {
  return (
    <Dialog {...props}>
      {close => (
        <>
          {title && <DocumentTitle title={title} />}
          <Back onClick={close} />
          <Container
            className={className}
            fixedHeight={fixedHeight}
            size={size}
          >
            <Header>
              <Title>{title}</Title>
              {/* Close button becomes deformed due to flex parent without this wrapper. */}
              <div>
                <CloseButton onClick={close} />
              </div>
            </Header>
            <Content>
              {isFunction<Dialog["children"]>(children)
                ? children(close)
                : children}
            </Content>
          </Container>
        </>
      )}
    </Dialog>
  )
}

export {DialogBox}
