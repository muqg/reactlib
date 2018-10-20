import * as React from "react";
import { Dialog } from ".";
import { styled } from "../styles";
import CloseButton from "./CloseButton";
import { DialogProps } from "./dialogs/Dialog";

const StyledDialog = styled(Dialog)`
    padding: 10% 0;
    transition: none;
`
const Image = styled.img`
    height: auto;
    max-height: 100%;
    max-width: 100%;
    width: auto;
`

interface Props {
    className?: string
    onClose: DialogProps["onClose"]
    src?: string
}


const ImageView = (props: Props) => {
    if(!props.src)
        return null

    return (
        <StyledDialog
            className={props.className}
            isVisible
            onClose={props.onClose}
        >
            {(close) => (
                <>
                    <CloseButton onClick={close} />
                    <Image src={props.src} />
                </>
            )}
        </StyledDialog>
    )
}


export { ImageView };

