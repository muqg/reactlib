import * as React from "react"
import "../../css/admin/sidebar.css"

class Sidebar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isActive: false
        }
    }

    render() {
        const activeClass = this.state.isActive ? " active" : ""
        const buttonElements = (this.props.buttons || []).map((btn, i) => {
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