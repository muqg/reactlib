import * as React from "react";
import { Editor } from "../../../utility/dom";
import { ToolbarItem } from "../ToolbarItem";
import { TOOLBAR_SPRITESHEET } from "../Toolbar";
import { styled } from "../../../styles";


const StyledToolbarItem = styled(ToolbarItem)`
    background-position-x: -120px;
`


interface Props {
}


const ToolbarIndent = (_props: Props) => {
    return(
        <StyledToolbarItem
            onClick={Editor.indent}
            title="Indent"
            backgroundImage={TOOLBAR_SPRITESHEET}
        />
    )
}


export { ToolbarIndent };
