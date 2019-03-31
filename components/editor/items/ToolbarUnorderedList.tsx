import * as React from "react"
import {Editor} from "../../../utility/dom"
import {ToolbarItem} from "../ToolbarItem"
import {TOOLBAR_SPRITESHEET} from "../Toolbar"
import {styled} from "../../../styles"

const StyledToolbarItem = styled(ToolbarItem)`
    background-position-x: -192px;
`

interface Props {}

const ToolbarUnorderedList = (_props: Props) => {
    return (
        <StyledToolbarItem
            onClick={Editor.unorderedList}
            title="Unordered list"
            backgroundImage={TOOLBAR_SPRITESHEET}
        />
    )
}

export {ToolbarUnorderedList}
