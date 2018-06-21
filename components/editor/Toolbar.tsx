import * as React from "react";
// @ts-ignore
import { connect } from "react-redux";
import { ToolbarItem } from "..";
import "../../css/toolbar.css";
import { Redux } from "../../main";
import { toolbarReducer } from "../../reducers";
import { StyleClass } from "../../utility";
import { classNames, Editor } from "../../utility/dom";
import ToolbarAlign from "./items/ToolbarAlign";
import ToolbarBold from "./items/ToolbarBold";
import ToolbarItalic from "./items/ToolbarItalic";
import ToolbarStrikethrough from "./items/ToolbarStrikethrough";
import ToolbarUnderline from "./items/ToolbarUnderline";
import ToolbarLink from "./items/ToolbarLink";
import ToolbarColour from "./items/ToolbarColour";


interface StateProps {
    isVisible: boolean
}
interface OwnProps {
    children?: any
}
interface State {
}

type Props = OwnProps & StateProps


class Toolbar extends React.Component<Props, State> {

    constructor(public props: Props) {
        super(props)

        this.state = {}
    }

    render() {
        const classes = classNames(
            "l_toolbar",
            {[StyleClass.Active]: this.props.isVisible}
        )

        return (
            <div className={classes}>
                <div>
                    <div className="l_tb_container">
                        <ToolbarBold />
                        <ToolbarItalic />
                        <ToolbarUnderline />
                        <ToolbarStrikethrough />
                        <ToolbarColour />
                        <ToolbarAlign position="left" />
                        <ToolbarAlign position="center" />
                        <ToolbarAlign position="right" />
                        <ToolbarAlign position="full" />
                        <ToolbarItem className="ordered_list tb_img" onClick={() => Editor.orderedList()} title="Ordered list" />
                        <ToolbarItem className="unordered_list tb_img" onClick={() => Editor.unorderedList()} title="Unordered list" />
                        <ToolbarItem className="indent tb_img" onClick={() => Editor.indent()} title="Indent" />
                        <ToolbarItem className="outdent tb_img" onClick={() => Editor.outdent()} title="Outdent" />
                        <ToolbarLink />

                        {/* TODO: React | Add titles. */}

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


Redux.addToState({lubToolbar: false})
Redux.addReducers({lubToolbar: toolbarReducer})

export default connect(mapStateToProps, null)(Toolbar) as React.ComponentType<OwnProps>
