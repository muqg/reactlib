import {MouseEvent} from "react"
import {styled} from "../../../styles"
import {Editor} from "../../../utility/dom"
import {ToolbarItem} from "../ToolbarItem"

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

const StyledSelect = styled.select`
  max-width: 120px;
`

interface Props {
  customFonts?: string[]
}

const ToolbarFontName = (props: Props) => {
  const fonts = [...FONT_NAMES, ...(props.customFonts || [])]
  return (
    <ToolbarItem className="input" title="Font name" animateHover={false}>
      <StyledSelect
        name="tb_font_name"
        onChange={(e) => Editor.fontName(e.target.value)}
        onContextMenu={onRightClick}
      >
        {fonts.map((name) => (
          <option value={name} style={{fontFamily: name}} key={name}>
            {name}
          </option>
        ))}
      </StyledSelect>
    </ToolbarItem>
  )
}

function onRightClick(event: MouseEvent<HTMLSelectElement>) {
  event.preventDefault()
  Editor.fontName((event.target as HTMLSelectElement).value)
}

export {ToolbarFontName}
