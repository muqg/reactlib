import * as React from "react";
import { SidebarButton } from ".";
import "../../css/sidebar.css";

interface Props {
    children?: any[]
    buttons?: Array<SidebarButton>
}

interface State {
    isActive: boolean
}

class Sidebar extends React.Component<Props, State> {
    buttons: any[]

    constructor(public props: Props) {
        super(props)
        this.buttons = this.props.buttons || []

        this.state = {
            isActive: false
        }
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
        this.setState(prevState => {
            return {isActive: !prevState.isActive}
        })
    }
}

export default Sidebar