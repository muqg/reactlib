import * as React from "react"
import {Editor} from "../../../utility/dom"
import {TOOLBAR_SPRITESHEET} from "../Toolbar"
import {ToolbarItem} from "../ToolbarItem"
import {styled} from "../../../styles"

const StyledToolbarItem = styled(ToolbarItem)`
    background-position-x: 0;
`

interface Props {}

const ToolbarAlignFull = (_props: Props) => {
    return (
        <StyledToolbarItem
            onClick={() => Editor.align("full")}
            title={"Align full"}
            backgroundImage={TOOLBAR_SPRITESHEET}
        />
    )
}

export {ToolbarAlignFull}
