import * as React from "react"
import ToolbarItem from "../ToolbarItem";
import { Editor } from "../../../utility/dom";


interface Props {
    position: "left" | "right" | "center" | "full"
}


const ToolbarAlign = (props: Props) => {
    return(
        <ToolbarItem
            className={`l_tb_align_${props.position} tb_img`}
            onClick={() => Editor.align(props.position)}
            title={props.position}
        />
    )
}


export default ToolbarAlign
