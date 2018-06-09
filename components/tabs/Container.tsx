import * as React from "react";
import "../../css/tabs.css";
import { classNames } from "../../utility/dom";

interface IProps {
    attributes?: {}
    children?: any
    className?: string
}

interface IState {
    tabIndex: number
}

class Container extends React.Component {
    props: IProps = {}
    state: IState = {
        tabIndex: 0
    }

    render() {
        const elements = {
            buttons: [] as JSX.Element[],
            tabs: [] as JSX.Element[]
        }

        React.Children.forEach(this.props.children, (child, i) => {
            child = child as JSX.Element
            elements.buttons.push(this.getButton(child, i))
            elements.tabs.push(this.getTab(child, i))
        })

        const classes = classNames("l_tabs_container", this.props.className)
        return (
            <div
                className={classes}
                {...this.props.attributes}
            >
                <div className="l_tab_buttons_container">
                    {elements.buttons}
                </div>
                {elements.tabs}
            </div>
        )
    }

    getButton(tab: JSX.Element, i: number) {
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
                    onClick={(e) => this.tabButtonClicked(e.target as HTMLElement)}
                    title={text}
                >
                    {text}
                </button>
            </div>
        )
    }

    getTab(tab: JSX.Element, i: number) {
        const cls = "l_tab_wrapper" + (this.state.tabIndex === i ? " active" : "")
        return (
            <div className={cls} key={i}>
                {tab}
            </div>
        )
    }

    tabButtonClicked(clicked: HTMLElement) {
        this.setState({
            tabIndex: parseInt(clicked.dataset.index as string)
        })
    }
}

export default Container