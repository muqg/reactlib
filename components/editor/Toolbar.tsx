import * as React from "react"
import {createPortal} from "react-dom"
import {COLOR_MAIN, styled} from "../../styles"
import {flex, position} from "../../styles/mixins"

export const TOOLBAR_SPRITESHEET = "/img/toolbar.png"

const ToolbarWrapper = styled.div`
    text-align: center;
    width: 100%;
    z-index: 1000;
    ${position("fixed", "0", "", "", "0")}

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
    height: 24px;
    ${flex("center", null, "row", "wrap")}
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
