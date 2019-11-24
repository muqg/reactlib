import React from "react"
import {Editor} from "../../../utility/dom"
import {ToolbarItem} from "../ToolbarItem"

interface Props {
  /**
   * Callback to handle the added image file.
   */
  handler: (file: File) => Promise<string>
}

export const ToolbarImage = (props: Props) => {
  return (
    <ToolbarItem title="Insert image">
      <label>
        <input
          accept=".jpg,.jpeg,.png"
          hidden={true}
          type="file"
          datatype="*.*"
          onChange={e => onChange(e, props.handler)}
        />
        <p>Img</p>
      </label>
    </ToolbarItem>
  )
}

async function onChange(
  event: React.ChangeEvent<HTMLInputElement>,
  handleImage: Props["handler"]
) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const file = target.files[0]

    Editor.insertImage(await handleImage(file))
  }
}
