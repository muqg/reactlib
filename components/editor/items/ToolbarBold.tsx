import * as React from "react";
import ToolbarItem from "../ToolbarItem";
import { Editor } from "../../../utility/dom";


interface Props {
}


const ToolbarBold = (_props: Props) => {
    return(
        <ToolbarItem onClick={() => Editor.bold()} title="Bold">
            <b>B</b>
        </ToolbarItem>
    )
}


export default ToolbarBold
