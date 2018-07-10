import * as React from "react";
import { Editor } from "../../../utility/dom";
import { ToolbarItem } from "../ToolbarItem";


interface Props {
}


const ToolbarOrderedList = (_props: Props) => {
    return(
        <ToolbarItem
            className="ordered_list tb_img"
            onClick={Editor.orderedList}
            title="Ordered list"
        />
    )
}


export { ToolbarOrderedList };
