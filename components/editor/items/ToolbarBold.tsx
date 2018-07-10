import * as React from "react";
import { Editor } from "../../../utility/dom";
import { ToolbarItem } from "../ToolbarItem";


interface Props {
}


const ToolbarBold = (_props: Props) => {
    return(
        <ToolbarItem onClick={Editor.bold} title="Bold">
            <b>B</b>
        </ToolbarItem>
    )
}


export { ToolbarBold };
