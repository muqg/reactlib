import * as React from "react";
import { isUndefined } from "util";
import { Button } from "..";
import { styled } from "../../styles";
import { CHAR_CODE_ENTER, CHAR_CODE_ESCAPE } from "../../utility/dom";
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
    onAccept: (container: HTMLDivElement, event: React.SyntheticEvent<any>) => void | boolean
    /**
     * Called whenever dialog is canceled (including when closed).
     */
    onReject?: (container: HTMLDivElement, event: React.SyntheticEvent<any>) => void
}
type Props = OwnProps & DialogProps


const ConfirmationDialog = (props: Props) => {
    const container = React.createRef<HTMLDivElement>()

    const accept = (event: React.SyntheticEvent<any>) => {
        const res = props.onAccept(container.current as HTMLDivElement, event)

        const success = !(isUndefined(res)) ? res : true
        if(success && props.onClose)
            props.onClose(event)
    }

    const reject = (event: React.SyntheticEvent<any>) => {
        if(props.onReject)
            props.onReject(container.current as HTMLDivElement, event)

        if(props.onClose)
            props.onClose(event)
    }

    const keyDown = (dialogElement: HTMLDivElement, event: React.KeyboardEvent) => {
        if(props.onKeyDown)
            props.onKeyDown(dialogElement, event)

        switch(event.keyCode) {
            case CHAR_CODE_ENTER:
                accept(event)
                break
            case CHAR_CODE_ESCAPE:
                reject(event)
                break
        }
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
