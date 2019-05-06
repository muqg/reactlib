import * as React from "react"
import {ToolbarItem} from "../ToolbarItem"
import {Editor} from "../../../utility/dom"
import {TOOLBAR_SPRITESHEET} from "../Toolbar"

interface Props {
  /**
   * Callback to handle the added image file.
   */
  handler: (file: File) => string
}

const ToolbarImage = (props: Props) => {
  return (
    <ToolbarItem title="Insert image" backgroundImage={TOOLBAR_SPRITESHEET}>
      <label>
        {/* TODO: Lib | Implement datatype. */}
        <input
          type="file"
          datatype="*.*"
          onChange={e => onChange(e, props.handler)}
        />
        <p>Img</p>
      </label>
    </ToolbarItem>
  )
}

function onChange(
  event: React.ChangeEvent<HTMLInputElement>,
  handleImage: Props["handler"],
) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const file = target.files[0]

    Editor.insertImage(handleImage(file))
  }
}

export {ToolbarImage}
