import * as React from "react";
import { createPortal } from "react-dom";
import "../../../css/input.css";
import { Editor } from "../../../utility/dom";
import { GUI_INPUT_CLASS } from "../../const";
import ConfirmationDialog from "../../dialogs/ConfirmationDialog";
import {ToolbarItem} from "../ToolbarItem";
import { styled } from "../../../styles";
import { TOOLBAR_SPRITESHEET } from "../Toolbar";


const StyledToolbarItem = styled(ToolbarItem)`
    background-position-x: -144px;
`

const StyledInput = styled.input`
    width: 100%;
`


interface Props {
}
interface State {
    isDialogVisible: boolean
}


/**
 * TODO: React | Allow link to be removed with right click.
 */
class ToolbarLink extends React.PureComponent<Props, State> {
    state = {
        isDialogVisible: false
    }
    portalTarget = document.getElementById("dialogPortal")

    toggleDialog(visible: boolean) {
        this.setState({isDialogVisible: visible})
    }

    accept(container: HTMLDivElement) {
        const input = container.querySelector("input")
        if(input) {
            const value = input.value
            if(!value.length)
                return false

            Editor.createLink(value)
            return true
        }
    }

    onShow(dialog: HTMLDivElement) {
        const input = dialog.querySelector("input")
        if(input) {
            input.value = ""
            input.focus()
        }
    }

    render() {
        return (
            <StyledToolbarItem
                className="link tb_img"
                title="Hyperlink"
                onClick={() => this.toggleDialog(true)}
                backgroundImage={TOOLBAR_SPRITESHEET}
            >
                {createPortal(
                    <ConfirmationDialog
                        className="tb_link"
                        title="Въведи линк:"
                        onShow={d => this.onShow(d)}
                        onClose={() => this.toggleDialog(false)}
                        onAccept={e => this.accept(e)}
                        visible={this.state.isDialogVisible}
                    >
                        <StyledInput className={GUI_INPUT_CLASS} placeholder="https://example.com" />
                    </ConfirmationDialog>,

                    document.getElementById("contentContainer") as HTMLElement
                )}
            </StyledToolbarItem>
        )
    }
}


export {ToolbarLink}
