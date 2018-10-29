import * as React from "react";
import { styled } from "../../styles";
import { flex } from "../../styles/mixins";
import { isFunction } from "../../utility/assertions";
import { Tab } from "./Tab";
import { TabTitleButton } from "./TabTitleButton";


const TitleContainer = styled.div`
    ${flex()}
    padding-top: 50px;
`


interface Props {
    children: React.ReactElement<Tab>[]
    className?: string
}

interface State {
    index: number
}


class TabView extends React.Component<Props, State> {
    state: State = {
        index: 0
    }

    changeIndex = (index: number) => {
        this.setState({index})
    }

    _getTitles() {
        return this.props.children.map(
            c => isFunction(c.props.title) ? c.props.title() : c.props.title
        )
    }

    render() {
        return (
            <div className={this.props.className}>
                <TitleContainer>
                    {this._getTitles().map((text, i) =>
                        <TabTitleButton
                            active={this.state.index === i}
                            index={i}
                            onClick={this.changeIndex}
                        >
                            {text}
                        </TabTitleButton>)
                    }
                </TitleContainer>

                {this.props.children[this.state.index]}
            </div>
        )
    }
}


export { TabView };

