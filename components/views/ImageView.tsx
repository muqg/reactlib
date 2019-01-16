import * as React from "react";
import { AspectImage, CloseButton, Dialog } from "..";
import { styled } from "../../styles";
import { position } from "../../styles/mixins";
import { DialogProps } from "../dialogs/Dialog";

const Back = styled.div`
    background: black;
    height: 100%;
    opacity: .75;
    width: 100%;
    z-index: -1;
    ${position("absolute", "0", "", "", "0")}
`

interface Props {
    className?: string
    closeOnClick?: boolean
    onClose: DialogProps["onClose"]
    src?: string
}


const ImageView = (props: Props) => {
    if(!props.src)
        return null

    return (
        <Dialog
            className={props.className}
            isVisible
            onKeyDown={e => e.stopPropagation()}
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


export { ImageView };

