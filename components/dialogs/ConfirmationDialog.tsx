import * as React from "react";
import { Button, DialogProps } from "..";
import { styled } from "../../styles";
import { Omit } from "../../utility";
import { isUndefined } from "../../utility/assertions";
import { CHAR_CODE_ENTER } from "../../utility/dom";
import { call } from "../../utility/function";
import { DialogBox, DialogBoxProps } from "./DialogBox";


const ButtonsContainer = styled.div`
    margin-top: 27px;
    text-align: center;
`
const StyledButton = styled(Button)`
    margin: 0 6px;
`


interface OwnProps {
    children?: React.ReactNode
    /**
     * Called when dialog resolves successfully. May optionally return a boolean
     * to indicate whether the acception was successful.
     */
    onAccept?: () => void | boolean
    /**
     * Called whenever dialog is canceled (including when closed).
     */
    onReject?: () => void

    /**
     * Text for the cancel (reject) button.
     */
    textCancel?: string
    /**
     * Text for the okay (accept) button.
     */
    textOkay?: string
}
type Props = OwnProps & DialogProps & Omit<DialogBoxProps, "children">


const ConfirmationDialog = ({textCancel = "Cancel", textOkay = "Okay", ...props}: Props) => {
    const container = React.createRef<HTMLDivElement>()

    const accept = () => {
        const res = call(props.onAccept)
        const success = !(isUndefined(res)) ? res : true

        if(success && props.onClose)
            props.onClose()
    }

    const reject = () => {
        call(props.onReject)
        call(props.onClose)
    }

    const keyDown: DialogProps["onKeyDown"] = (event) => {
        if(event.keyCode === CHAR_CODE_ENTER)
            accept()

        call(props.onKeyDown, event)
    }

    return(
        <DialogBox {...props} onKeyDown={keyDown} onClose={reject}>
            {close => {
                return (
                    <div>
                        <div ref={container}>
                            {props.children}
                        </div>
                        <ButtonsContainer>
                            <StyledButton onClick={() => { accept(); close(); }}>
                                {textOkay}
                            </StyledButton>
                            <StyledButton onClick={() => { reject(); close(); }}>
                                {textCancel}
                            </StyledButton>
                        </ButtonsContainer>
                    </div>
                )
            }}
        </DialogBox>
    )
}


export default ConfirmationDialog
