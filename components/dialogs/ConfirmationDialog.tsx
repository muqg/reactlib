import * as React from "react";
import { isUndefined } from "util";
import { Button } from "..";
import { dialog, InjectedDialogProps } from "../../hoc";
import { styled } from "../../styles";
import { CHAR_CODE_ENTER } from "../../utility/dom";
import { DialogTemplate, TemplateProps } from "./DialogTemplate";


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

    /**
     * Text for the cancel (reject) button.
     */
    textCancel?: string
    /**
     * Text for the okay (accept) button.
     */
    textOkay?: string
}
type Props = OwnProps & InjectedDialogProps & TemplateProps


const ConfirmationDialog = ({textCancel = "Cancel", textOkay = "Okay", ...props}: Props) => {
    const container = React.createRef<HTMLDivElement>()

    const accept = () => {
        const res = props.onAccept(container.current as HTMLDivElement)
        const success = !(isUndefined(res)) ? res : true

        if(success)
            props.closeDialog()
    }

    const reject = () => {
        if(props.onReject)
            props.onReject(container.current as HTMLDivElement)
        props.closeDialog()
    }

    const keyDown = (event: React.KeyboardEvent) => {
        if(event.keyCode === CHAR_CODE_ENTER)
            accept()
    }

    return(
        <DialogTemplate {...props}>
            <div onKeyDown={keyDown}>
                <div ref={container}>
                    {props.children}
                </div>
                <ButtonsContainer>
                    <Button onClick={accept} margin={"0 6px"}>
                        {textOkay}
                    </Button>
                    <Button onClick={reject} margin={"0 6px"}>
                        {textCancel}
                    </Button>
                </ButtonsContainer>
            </div>
        </DialogTemplate>
    )
}


export default dialog(ConfirmationDialog)
