import * as React from "react";
import { Dialog } from ".";
import { COLOR_BLACK, COLOR_WHITE, styled } from "../styles";
import CloseButton from "./CloseButton";
import { DialogProps } from "./dialogs/Dialog";

const StyledDialog = styled(Dialog)`
    padding: 0;
    transition: none;
`
const Image = styled.img`
    height: auto;
    max-height: 100%;
    max-width: 100%;
    width: auto;
`
const Back = styled.div`
    background: ${COLOR_BLACK};
    height: 100%;
    left: 0;
    opacity: .75;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -1;
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
        <StyledDialog
            className={props.className}
            isVisible
            onClose={props.onClose}
        >
            {(close) => (
                <>
                    <Back onClick={close} />
                    <CloseButton color={COLOR_WHITE} onClick={close} />
                    <Image src={props.src} onClick={props.closeOnClick ? close : undefined} />
                </>
            )}
        </StyledDialog>
    )
}


export { ImageView };

