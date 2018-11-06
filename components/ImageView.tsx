import * as React from "react";
import { AspectImage, CloseButton, Dialog } from ".";
import { COLOR_BLACK, COLOR_WHITE, createGlobalStyle, styled } from "../styles";
import { position } from "../styles/mixins";
import { DialogProps } from "./dialogs/Dialog";

const NoScroll = createGlobalStyle`
    body {
        overflow: hidden !important;
    }
`
const StyledDialog = styled(Dialog)`
    padding: 0;
    transition: none;
`
const Back = styled.div`
    background: ${COLOR_BLACK};
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
        <StyledDialog
            className={props.className}
            isVisible
            onClose={props.onClose}
        >
            {(close) => (
                <>
                    <Back onClick={close} />
                    <CloseButton color={COLOR_WHITE} onClick={close} />
                    <AspectImage
                        onClick={props.closeOnClick ? close : undefined}
                        size="100%"
                        src={props.src}
                    />
                    <NoScroll />
                </>
            )}
        </StyledDialog>
    )
}


export { ImageView };

