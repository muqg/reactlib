import * as React from "react";
import { createPortal } from "react-dom";
import { COLOR_PRIMARY_LIGHT, styled } from "../../styles";
import { flexCenterMixin, positionMixin } from "../../styles/mixins";


export const TOOLBAR_SPRITESHEET = "/img/toolbar.png"

const ToolbarWrapper = styled.div`
    text-align: center;
    width: 100%;
    z-index: 110;
    ${positionMixin("fixed", "0", null, null, "0")}

    > div {
        background: ${COLOR_PRIMARY_LIGHT};
        border-radius: 6px;
        box-shadow: 0 2px 0 0 #aaa;
        cursor: default;
        display: inline-block;
        padding: 3px 6px;
    }
`

const ToolbarContainer = styled.div`
    flex-wrap: wrap;
    height: 24px;
    ${flexCenterMixin("row")}
`


interface Props {
    children?: any
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

interface State {
}


class Toolbar extends React.Component<Props, State> {
    state = {}

    render() {
        return createPortal(
            <ToolbarWrapper>
                <div>
                    <ToolbarContainer>

                        {this.props.children}

                    </ToolbarContainer>
                </div>
            </ToolbarWrapper>,

            document.body
        )
    }
}

export { Toolbar };

