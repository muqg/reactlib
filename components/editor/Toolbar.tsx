import {createPortal} from "react-dom"
import {COLOR_MAIN, styled} from "../../styles"

export const TOOLBAR_SPRITESHEET = "/img/toolbar.png"

const ToolbarWrapper = styled.div`
  left: 0;
  position: fixed;
  top: 0;
  text-align: center;
  width: 100%;
  z-index: 1000;

  > div {
    background: ${COLOR_MAIN};
    border-radius: 6px;
    box-shadow: 0 2px 0 0 #aaa;
    cursor: default;
    display: inline-block;
    padding: 3px 6px;
  }
`

const ToolbarContainer = styled.div`
  display: flex;
  height: 24px;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
`

interface Props {
  children?: any
  className?: string
  /**
   * Custom font names to add as options.
   *
   * Note that these fonts must be manually served to the user if they are not
   * supported by the browser.
   */
  fonts?: string[]
  /**
   * Callback to handle image file upload. Should return a string, representing
   * the url to the uploaded file that will be used as src when adding the image
   * element to the editor.
   */
  imageHandler?: (file: File) => string
}

function Toolbar({children, className}: Props) {
  return createPortal(
    <ToolbarWrapper className={className}>
      <div>
        <ToolbarContainer>{children}</ToolbarContainer>
      </div>
    </ToolbarWrapper>,

    document.body
  )
}

export {Toolbar}
