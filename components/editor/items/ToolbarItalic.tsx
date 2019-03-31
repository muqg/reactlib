import * as React from "react"
import {ToolbarItem} from "../ToolbarItem"
import {Editor} from "../../../utility/dom"

interface Props {}

const ToolbarItalic = (_props: Props) => {
    return (
        <ToolbarItem onClick={Editor.italic} title="Italic">
            <i>I</i>
        </ToolbarItem>
    )
}

export {ToolbarItalic}
