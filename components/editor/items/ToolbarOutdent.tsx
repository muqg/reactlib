import * as React from "react";
import { Editor } from "../../../utility/dom";
import { ToolbarItem } from "../ToolbarItem";


interface Props {
}


const ToolbarOutdent = (_props: Props) => {
    return(
        <ToolbarItem
            className="outdent tb_img"
            onClick={Editor.outdent}
            title="Outdent"
        />
    )
}


export { ToolbarOutdent };
