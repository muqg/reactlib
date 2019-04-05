import * as React from "react"
import {useState} from "react"
import {useModel} from "../../../hooks"
import {styled} from "../../../styles"
import {Editor} from "../../../utility/dom"
import ConfirmationDialog from "../../dialogs/ConfirmationDialog"
import {TextInput} from "../../inputs"
import {TOOLBAR_SPRITESHEET} from "../Toolbar"
import {ToolbarItem} from "../ToolbarItem"

const StyledToolbarItem = styled(ToolbarItem)`
    background-position-x: -144px;
`

/**
 * TODO: Lib | Allow link to be removed with right click.
 */
function ToolbarLink() {
    const [dialog, setDialog] = useState(false)
    const model = useModel<{input: string}>(() => ({
        input: "",
    }))

    const accept = () => {
        const value = model.input.value
        if (value.length) {
            Editor.createLink(value)
            return true
        }
    }

    return (
        <StyledToolbarItem
            className="link tb_img"
            title="Hyperlink"
            onClick={() => setDialog(true)}
            backgroundImage={TOOLBAR_SPRITESHEET}
        >
            {dialog && (
                <ConfirmationDialog
                    className="tb_link"
                    onAccept={accept}
                    onClose={() => setDialog(false)}
                    title="Въведи линк:"
                >
                    <TextInput
                        {...model.input}
                        placeholder="https://example.com"
                        wide
                    />
                </ConfirmationDialog>
            )}
        </StyledToolbarItem>
    )
}

export {ToolbarLink}
