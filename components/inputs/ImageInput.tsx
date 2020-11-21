import {
  ChangeEvent,
  ComponentProps,
  ComponentType,
  forwardRef,
  Ref,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  AspectImage,
  Block,
  Button,
  ConfirmationDialog,
  ImageView,
  RemoveButton,
} from "../"
import {styled} from "../../styles"
import {Size} from "../../utility"
import {isString} from "../../utility/assertions"
import {call} from "../../utility/function"

const PreviewContainer = styled.div`
  display: inline-block;
  position: relative;
`
const Preview = styled(AspectImage)`
  display: inline-block;
  margin: 6px;
  vertical-align: middle;
`
const StyledRemoveButton = styled(RemoveButton)`
  position: absolute;
  right: 0;
  top: 0;
`

type ConfirmationComponentProps = Pick<
  ComponentProps<typeof ConfirmationDialog>,
  "onAccept" | "onClose"
>
interface OwnProps {
  /**
   * A dialog to confirm the removal.
   * - It is recomended that a ConfirmationDialog is used.
   * - The component is passed `onAccept` and `onClose`.
   */
  confirmationComponent?: ComponentType<ConfirmationComponentProps>
  /**
   * Whether image can be changed or not.
   */
  isChangeable?: boolean
  /**
   * Called when image removal is requested.
   */
  onRemove?: () => void
  /**
   * Image source.
   */
  src?: string
}
type Props = OwnProps & {innerRef?: Ref<any>}

function ImageInput(props: Props) {
  if (__DEV__) {
    useEffect(() => {
      if (!props.onRemove && props.confirmationComponent) {
        console.warn(
          "`confirmationComponent` prop serves no purpose" +
            "without the complementary `onRemove` prop"
        )
      }
    }, [])
  }

  const [showLarge, setShowLarge] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [preview, setPreview] = useState<string | undefined>(props.src)

  const fileReader = useMemo(() => {
    const reader = new FileReader()

    reader.onloadend = () => {
      const result = reader.result
      if (isString(result)) {
        setPreview(result)
      }
    }

    return reader
  }, [])

  useEffect(() => setPreview(props.src), [props.src])

  function change(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const file = e.target.files[0]
      if (file) {
        fileReader.readAsDataURL(e.target.files[0])
      } else {
        setPreview(props.src)
      }
    }
  }

  function remove(e: SyntheticEvent) {
    e.stopPropagation()

    // TODO: only remove if no new file is selected.
    // Otherwise set preview back to props.src
    // Remember that this will not reset the input element though since it
    // is reset only when props.src changes. Resetting it when preview
    // changes does not work since preview changes once a file is selected
    // and hence will reset the input incorrectly.
    call(props.onRemove)
  }

  const ConfirmationComponent = props.confirmationComponent
  return (
    <Block title="Изображение (снимка)">
      {props.isChangeable && (
        <label>
          <input
            accept=".png,.jpg,.jpeg"
            hidden
            key={props.src}
            name="img"
            onChange={change}
            ref={props.innerRef}
            type="file"
          />
          <Button as="span">Избор</Button>
        </label>
      )}

      {preview && (
        <PreviewContainer>
          <Preview
            onClick={() => setShowLarge(true)}
            src={preview}
            size="160px"
          />
          {props.onRemove && (
            <StyledRemoveButton
              hover={false}
              onClick={
                ConfirmationComponent ? () => setIsConfirming(true) : remove
              }
              size={Size.Slim}
            />
          )}
        </PreviewContainer>
      )}
      {ConfirmationComponent && props.onRemove && isConfirming && (
        <ConfirmationComponent
          onAccept={props.onRemove}
          onClose={() => setIsConfirming(false)}
        />
      )}
      {showLarge && (
        <ImageView
          closeOnClick
          onClose={() => setShowLarge(false)}
          src={preview}
        />
      )}
    </Block>
  )
}

const image = forwardRef<HTMLInputElement, OwnProps>((props, ref) => (
  <ImageInput {...props} innerRef={ref} />
))
export {image as ImageInput}
