import {AspectImage, CloseButton, Dialog, DialogProps} from "."
import {styled} from "../styles"

const Back = styled.div`
  background: black;
  bottom: 0;
  left: 0;
  opacity: 0.75;
  position: absolute;
  right: 0;
  top: 0;
  z-index: -1;
`

interface Props {
  className?: string
  closeOnClick?: boolean
  onClose: DialogProps["onClose"]
  src?: string
}

const ImageView = (props: Props) => {
  if (!props.src) {
    return null
  }

  return (
    <Dialog
      className={props.className}
      onKeyDown={(e) => e.stopPropagation()}
      onClose={props.onClose}
    >
      {(close) => (
        <>
          <Back onClick={close} />
          <CloseButton absolute color="#ffffff" onClick={close} />
          <AspectImage
            onClick={props.closeOnClick ? close : undefined}
            size="100%"
            src={props.src}
          />
        </>
      )}
    </Dialog>
  )
}

export {ImageView}
