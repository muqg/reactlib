import * as React from "react";
import { Editor } from "../../../utility/dom";
import { TOOLBAR_SPRITESHEET } from "../Toolbar";
import { ToolbarItem } from "../ToolbarItem";
import { styled } from "../../../styles";


const StyledToolbarItem = styled(ToolbarItem)`
    background-position-x: -24px;
`


interface Props {
}


const ToolbarAlignCenter = (_props: Props) => {
    return(
        <StyledToolbarItem
            onClick={() => Editor.align("center")}
            title={"Align center"}
            backgroundImage={TOOLBAR_SPRITESHEET}
        />
    )
}


export { ToolbarAlignCenter };
