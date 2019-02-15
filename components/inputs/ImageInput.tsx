import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { AspectImage, Block, Button, ImageView } from "../../../lub/components";
import { styled } from "../../../lub/styles";
import { isString } from "../../../lub/utility/assertions";


const Preview = styled(AspectImage)`
    display: inline-block;
    margin: 6px;
    vertical-align: middle;
`

interface OwnProps {
    src?: string
}
type Props = OwnProps & {innerRef?: React.Ref<any>}


function ImageInput(props: Props) {
    const [showLarge, setShowLarge] = useState(false)
    const [preview, setPreview] = useState<string | undefined>(props.src)
    const fileReader = useRef(new FileReader())

    useEffect(() => {
        const reader = fileReader.current

        reader.onloadend = () => {
            if(isString(reader.result)) {
                setPreview(reader.result)
            }
        }
    }, [])

    useEffect(() => setPreview(props.src), [props.src])

    function change(e: React.ChangeEvent<HTMLInputElement>) {
        if(e.target.files) {
            const file = e.target.files[0]
            if(file) {
                fileReader.current.readAsDataURL(e.target.files[0])
            }
            else {
                setPreview(props.src)
            }
        }
    }

    return (
        <Block title="Изображение (снимка)">
            <label>
                <input
                    accept=".png,.jpg,.jpeg"
                    hidden
                    name="img"
                    onChange={change}
                    ref={props.innerRef}
                    type="file"
                />
                <Button as="span">
                    Избор
                </Button>
            </label>

            {preview &&
                <Preview
                    onClick={() => setShowLarge(true)}
                    src={preview}
                    size="160px"
                />
            }
            {showLarge &&
                <ImageView
                    closeOnClick
                    onClose={() => setShowLarge(false)}
                    src={preview}
                />
            }
        </Block>
    )
}


const image = React.forwardRef<HTMLInputElement, OwnProps>(
    (props, ref) => <ImageInput {...props} innerRef={ref} />
)
export { image as ImageInput };

