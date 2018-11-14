import * as React from "react";
import { useState } from "react";
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


function TabView(props: Props) {
    const [tabIndex, setTabIndex] = useState(0)

    function _getTitles() {
        return props.children.map(
            c => isFunction(c.props.title) ? c.props.title() : c.props.title
        )
    }

    return (
        <div className={props.className}>
            <TitleContainer>
                {_getTitles().map((text, i) =>
                    <TabTitleButton
                        active={tabIndex === i}
                        index={i}
                        onClick={setTabIndex}
                    >
                        {text}
                    </TabTitleButton>)
                }
            </TitleContainer>

            {props.children[tabIndex]}
        </div>
    )
}

export { TabView };

