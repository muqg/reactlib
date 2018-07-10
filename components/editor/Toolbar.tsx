import * as React from "react";
// @ts-ignore
import { connect } from "react-redux";
import "../../css/toolbar.css";
import { ReduxFactory } from "../../main";
import { toolbarReducer } from "../../reducers";
import { StyleClass } from "../../utility";
import { classNames } from "../../utility/dom";


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
        const classes = classNames(
            "l_toolbar",
            {[StyleClass.Active]: this.props.isVisible}
        )

        return (
            <div className={classes}>
                <div>
                    <div className="l_tb_container">

                        {this.props.children}

                    </div>
                </div>
            </div>
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
export { toolbar as Toolbar }
