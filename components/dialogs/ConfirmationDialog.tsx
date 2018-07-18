import * as React from "react";
import { isUndefined } from "util";
import { Button } from "..";
import { styled } from "../../styles";
import { CHAR_CODE_ENTER } from "../../utility/dom";
import Dialog, { DialogProps } from "../dialogs/Dialog";


const ButtonsContainer = styled.div`
    margin-top: 27px;
    text-align: center;
`


interface OwnProps {
    children?: any
    /**
     * Called when dialog resolves successfully. May optionally return a boolean
     * to indicate whether the acception was successful.
     */
    onAccept: (container: HTMLDivElement) => void | boolean
    /**
     * Called whenever dialog is canceled (including when closed).
     */
    onReject?: (container: HTMLDivElement) => void
}
type Props = OwnProps & DialogProps


const ConfirmationDialog = (props: Props) => {
    const container = React.createRef<HTMLDivElement>()

    const accept = () => {
        const res = props.onAccept(container.current as HTMLDivElement)

        const success = !(isUndefined(res)) ? res : true
        if(success && props.onClose)
            props.onClose()
    }

    const reject = () => {
        if(props.onReject)
            props.onReject(container.current as HTMLDivElement)

        if(props.onClose)
            props.onClose()
    }

    const keyDown = (event: React.KeyboardEvent, dialogElement: HTMLDivElement) => {
        if(props.onKeyDown)
            props.onKeyDown(event, dialogElement)

        if(event.keyCode === CHAR_CODE_ENTER)
            accept()
    }

    return(
        <Dialog {...props} onClose={reject} onKeyDown={keyDown}>
            <div ref={container}>
                {props.children}
            </div>
            <ButtonsContainer>
                <Button onClick={accept} margin={"0 6px"}>Okay</Button>
                <Button onClick={reject} margin={"0 6px"}>Cancel</Button>
            </ButtonsContainer>
        </Dialog>
    )
}


export default ConfirmationDialog
