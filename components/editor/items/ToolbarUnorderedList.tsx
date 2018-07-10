import * as React from "react";
import { Editor } from "../../../utility/dom";
import { ToolbarItem } from "../ToolbarItem";


interface Props {
}


const ToolbarUnorderedList = (_props: Props) => {
    return(
        <ToolbarItem
            className="unordered_list tb_img"
            onClick={Editor.unorderedList}
            title="Unordered list"
        />
    )
}


export { ToolbarUnorderedList };
