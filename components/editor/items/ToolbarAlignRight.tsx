import * as React from "react";
import { Editor } from "../../../utility/dom";
import { TOOLBAR_SPRITESHEET } from "../Toolbar";
import { ToolbarItem } from "../ToolbarItem";
import { styled } from "../../../styles";


const StyledToolbarItem = styled(ToolbarItem)`
    background-position-x: -72px;
`


interface Props {
}


const ToolbarAlignRight = (_props: Props) => {
    return(
        <StyledToolbarItem
            onClick={() => Editor.align("right")}
            title={"Align right"}
            backgroundImage={TOOLBAR_SPRITESHEET}
        />
    )
}


export { ToolbarAlignRight };
