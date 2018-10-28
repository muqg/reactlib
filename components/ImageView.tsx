import * as React from "react";
import { AspectImage, Dialog } from ".";
import { COLOR_BLACK, COLOR_WHITE, styled } from "../styles";
import { positionMixin } from "../styles/mixins";
import CloseButton from "./CloseButton";
import { DialogProps } from "./dialogs/Dialog";

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
    ${positionMixin("absolute", "0", null, null, "0")}
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
                </>
            )}
        </StyledDialog>
    )
}


export { ImageView };

