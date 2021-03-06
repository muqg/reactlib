import {AspectImage, CloseButton, Dialog, DialogProps} from "."
import {styled} from "../styles"
import {position} from "../styles/mixins"

const Back = styled.div`
  background: black;
  opacity: 0.75;
  z-index: -1;
  ${position("absolute", "0", "0", "0", "0")}
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
