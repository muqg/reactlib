import * as React from "react";
// @ts-ignore
import { connect } from "react-redux";
import { ReduxFactory } from "../../main";
import { toolbarReducer } from "../../reducers";
import { styled } from "../../styles";


export const TOOLBAR_SPRITESHEET = "/img/toolbar.png"

const ToolbarWrapper = styled.div`
    left: 0;
    position: fixed;
    text-align: center;
    top: 0;
    width: 100%;
    z-index: 110;

    > div {
        background: #ddd;
        border-radius: 6px;
        box-shadow: 0 2px 0 0 #aaa;
        cursor: default;
        display: inline-block;
        padding: 3px 6px;
    }
`

const ToolbarContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    height: 24px;
    justify-content: center;
`


interface StateProps {
    isVisible: boolean
}

interface OwnProps {
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

type Props = OwnProps & StateProps


class Toolbar extends React.Component<Props, State> {
    state = {}

    render() {
        return (
            <ToolbarWrapper>
                <div>
                    <ToolbarContainer>

                        {this.props.children}

                    </ToolbarContainer>
                </div>
            </ToolbarWrapper>
        )
    }
}


const mapStateToProps = (state: any): StateProps => {
    return {
        isVisible: state.lubToolbar
    }
}


ReduxFactory.addToState({lubToolbar: false})
ReduxFactory.addReducers({lubToolbar: toolbarReducer})

const toolbar = connect(mapStateToProps, null)(Toolbar) as React.ComponentType<OwnProps>
export { toolbar as Toolbar };
