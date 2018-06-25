import * as React from "react";
import { Editor } from "../../../utility/dom";
import ToolbarItem from "../ToolbarItem";


interface Props {
    position: "left" | "right" | "center" | "full"
}


const ToolbarAlign = (props: Props) => {
    return(
        <ToolbarItem
            className={`l_tb_align_${props.position} tb_img`}
            onClick={() => Editor.align(props.position)}
            title={"Align " + props.position}
        />
    )
}


export default ToolbarAlign
