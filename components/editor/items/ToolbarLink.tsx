import * as React from "react";
import { createPortal } from "react-dom";
import "../../../css/input.css";
import { Editor } from "../../../utility/dom";
import { GUI_INPUT_CLASS } from "../../const";
import ConfirmationDialog from "../../dialogs/ConfirmationDialog";
import ToolbarItem from "../ToolbarItem";


interface Props {
}
interface State {
    isDialogVisible: boolean
}


class ToolbarLink extends React.Component<Props, State> {
    portalTarget = document.getElementById("dialogPortal")

    constructor(public props: Props) {
        super(props)

        this.state = {
            isDialogVisible: false
        }
    }

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

    onOpen(dialog: HTMLDivElement | null) {
        if(!dialog)
            return

        const input = dialog.querySelector("input")
        if(input) {
            input.value = ""
            input.focus()
        }
    }

    render() {
        return (
            <ToolbarItem
                className="link tb_img"
                title="Hyperlink"
                onClick={() => this.toggleDialog(true)}
            >
                {createPortal(
                    <ConfirmationDialog
                        className="tb_link"
                        title="Въведи линк:"
                        onClose={() => this.toggleDialog(false)}
                        onAccept={e => this.accept(e)}
                        onOpen={d => this.onOpen(d)}
                        visible={this.state.isDialogVisible}
                    >
                        <input className={GUI_INPUT_CLASS} placeholder="https://example.com" />
                    </ConfirmationDialog>,

                    document.getElementById("contentContainer") as HTMLElement
                )}
            </ToolbarItem>
        )
    }
}


export default ToolbarLink
