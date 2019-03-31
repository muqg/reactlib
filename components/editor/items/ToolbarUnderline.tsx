import * as React from "react"
import {ToolbarItem} from "../ToolbarItem"
import {Editor} from "../../../utility/dom"

interface Props {}

const ToolbarUnderline = (_props: Props) => {
    return (
        <ToolbarItem onClick={Editor.underline} title="Underline">
            <u>U</u>
        </ToolbarItem>
    )
}

export {ToolbarUnderline}
