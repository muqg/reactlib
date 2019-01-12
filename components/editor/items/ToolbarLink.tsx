import * as React from "react";
import { styled } from "../../../styles";
import { Editor } from "../../../utility/dom";
import ConfirmationDialog from "../../dialogs/ConfirmationDialog";
import { Input } from "../../styled/Input";
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
    inputRef = React.createRef<any>()

    toggleDialog = (visible: boolean) => {
        this.setState({isDialogVisible: visible})
    }

    accept = () => {
        const input = this.inputRef.current
        if(input) {
            const value = input.value
            if(!value.length)
                return false

            Editor.createLink(value)
            return true
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
                <ConfirmationDialog
                    className="tb_link"
                    isVisible={this.state.isDialogVisible}
                    onAccept={this.accept}
                    visibilityChange={this.toggleDialog}
                    title="Въведи линк:"
                >
                    <Input placeholder="https://example.com" ref={this.inputRef} width="100%" />
                </ConfirmationDialog>
            </StyledToolbarItem>
        )
    }
}


export { ToolbarLink };

