import * as React from "react"
import { ToolbarItem } from "../ToolbarItem";
import { Editor } from "../../../utility/dom";


const FONT_NAMES = [
    "Arial",
    "Arial Black",
    "Courier New",
    "Comic Sans MS",
    "Georgia",
    "Impact",
    "Tahoma",
    "Times New Roman",
    "Verdana",
]


interface Props {
    customFonts?: string[]
}


const ToolbarFontName = (props: Props) => {
    const fonts = [...FONT_NAMES, ...(props.customFonts || [])]
    return(
        <ToolbarItem className="input" title="Font name">
            <select
                name="tb_font_name"
                onChange={e => Editor.fontName(e.target.value)}
                onContextMenu={onRightClick}
            >
                {fonts.map(name => (
                    <option value={name} style={{fontFamily: name}} key={name}>
                        {name}
                    </option>
                ))}
            </select>
        </ToolbarItem>
    )
}


function onRightClick(event: React.MouseEvent<HTMLSelectElement>) {
    event.preventDefault()
    Editor.fontName((event.target as HTMLSelectElement).value)
}


export {ToolbarFontName}
