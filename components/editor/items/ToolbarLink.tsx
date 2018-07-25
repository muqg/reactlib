import * as React from "react";
import { createPortal } from "react-dom";
import { Input } from "../..";
import { CONTENT_CONTAINER_ELEMENT } from "../../../main";
import { styled } from "../../../styles";
import { Editor } from "../../../utility/dom";
import ConfirmationDialog from "../../dialogs/ConfirmationDialog";
import { TOOLBAR_SPRITESHEET } from "../Toolbar";
import { ToolbarItem } from "../ToolbarItem";


const StyledToolbarItem = styled(ToolbarItem)`
    background-position-x: -144px;
`


interface Props {
}
interface State {
    isDialogVisible: boolean
}


/**
 * TODO: Lib | Allow link to be removed with right click.
 */
class ToolbarLink extends React.PureComponent<Props, State> {
    state = {
        isDialogVisible: false
    }
    portalTarget = document.getElementById("dialogPortal")

    toggleDialog = (visible: boolean) => {
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
                        isVisible={this.state.isDialogVisible}
                        onShow={d => this.onShow(d)}
                        onAccept={e => this.accept(e)}
                        visibilityChange={this.toggleDialog}
                        title="Въведи линк:"
                    >
                        <Input placeholder="https://example.com" width="100%" />
                    </ConfirmationDialog>,

                    CONTENT_CONTAINER_ELEMENT
                )}
            </StyledToolbarItem>
        )
    }
}


export { ToolbarLink };
