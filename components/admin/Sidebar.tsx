import * as React from "react";
import { SidebarButton } from ".";
import "../../css/admin/sidebar.css";

interface IProps {
    children?: any[]
    buttons?: Array<SidebarButton>
}

class Sidebar extends React.Component {
    state = {
        isActive: false
    }
    buttons: any[]

    constructor(public props: IProps) {
        super(props)
        this.buttons = this.props.buttons || []
    }


    render() {
        const activeClass = this.state.isActive ? " active" : ""
        const buttonElements = this.buttons.map((btn: any, i) => {
                return <SidebarButton {...btn} key={i} />
        })

        return(
            <div className={"l_sidebar" + activeClass}>
                <i
                    className="l_sidebar_back"
                    onClick={() => { this.onArrowClicked() }}
                ></i>
                <button
                    className={"l_sidebar_arrow" + activeClass}
                    onClick={() => { this.onArrowClicked() }}
                >
                    <span></span>
                </button>
                <ul className="l_sidebar_list">
                    {buttonElements}
                    {this.props.children}
                </ul>
            </div>
        )
    }

    onArrowClicked() {
        this.setState({
            isActive: !this.state.isActive
        })
    }
}

export default Sidebar