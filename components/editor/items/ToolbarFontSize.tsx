
import * as React from "react";
import { COLOR_MAIN, COLOR_BACKGROUND, styled } from "../../../styles";
import { Editor } from "../../../utility/dom";
import { asInt } from "../../../utility/string";
import { ToolbarItem } from "../ToolbarItem";


const StyledSelect = styled.select`
    background: ${COLOR_BACKGROUND};
    border: 1px solid ${COLOR_MAIN};
    min-width: auto;
    max-width: 120px;
    padding: 2px;
`


interface Props {
}


const ToolbarFontSize = (_props: Props) => {
    return(
        <ToolbarItem className="input" title="Font size" animateHover={false}>
            <StyledSelect name="tb_font_size" onChange={e => setSize(e.target)} onContextMenu={onRightClick}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3" selected>3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
            </StyledSelect>
        </ToolbarItem>
    )
}

function onRightClick(event: React.MouseEvent<HTMLSelectElement>) {
    event.preventDefault()
    setSize(event.target as HTMLSelectElement)
}

function setSize(select: HTMLSelectElement) {
    Editor.fontSize(asInt(select.value) as 1 | 2 | 3 | 4 | 5 | 6 |7)
}


export { ToolbarFontSize };

