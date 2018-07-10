import * as React from "react";
import { Editor } from "../../../utility/dom";
import { ToolbarItem } from "../ToolbarItem";


interface Props {
}


const ToolbarSubscript = (_props: Props) => {
    return(
        <ToolbarItem
            onClick={Editor.subscript}
            title="Subscript"
        >
            <p>
                x<sub>2</sub>
            </p>
        </ToolbarItem>
    )
}


export { ToolbarSubscript };
