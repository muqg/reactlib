import * as React from "react";
import { Editor } from "../../../utility/dom";
import { ToolbarItem } from "../ToolbarItem";


interface Props {
}


const ToolbarIndent = (_props: Props) => {
    return(
        <ToolbarItem
            className="indent tb_img"
            onClick={Editor.indent}
            title="Indent"
        />
    )
}


export { ToolbarIndent };
