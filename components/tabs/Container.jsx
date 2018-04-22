import * as React from "react"
import "../../css/tabs.css"


class Container extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            tabIndex: 0
        }
    }

    render() {
        const elements = {
            buttons: [],
            tabs: []
        }

        React.Children.forEach(this.props.children, (child, i) => {
            elements.buttons.push(this.getButton(child, i))
            elements.tabs.push(this.getTab(child, i))
        })

        return (
            <div
                className={["l_tabs_container", this.props.className].join(" ")}
                {...this.attributes}
            >
                <div className="l_tab_buttons_container">
                    {elements.buttons}
                </div>
                {elements.tabs}
            </div>
        )
    }

    getButton(tab, i) {
        const text = tab.props.buttonText
        if(!text)
            throw("Tab's buttonText attribute is required and must evaluate to true.")

        const cls = "l_tab_button" + (this.state.tabIndex === i ? " active" : "")
        return (
            <div
                className={cls}
                key={i}
            >
                <button
                    data-index={i}
                    onClick={(e) => this.tabButtonClicked(e.target)}
                    title={text}
                >
                    {text}
                </button>
            </div>
        )
    }

    getTab(tab, i) {
        const cls = "l_tab_wrapper" + (this.state.tabIndex === i ? " active" : "")
        return (
            <div className={cls} key={i}>
                {tab}
            </div>
        )
    }

    tabButtonClicked(clicked) {
        this.setState({
            tabIndex: parseInt(clicked.dataset.index)
        })
    }
}

export default Container