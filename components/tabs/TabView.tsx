import * as React from "react";
import { useState } from "react";
import { styled, COLOR_DARK } from "../../styles";
import { flex } from "../../styles/mixins";
import { isFunction } from "../../utility/assertions";
import { Tab } from "./Tab";
import { TabTitleButton } from "./TabTitleButton";

const Container = styled.div`
    width: 100%;
`
const TitleContainer = styled.div`
    border-bottom: 1px solid ${COLOR_DARK};
    ${flex()}
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
        <Container className={props.className}>
            <TitleContainer>
                {_getTitles().map((text, i) =>
                    <TabTitleButton
                        active={tabIndex === i}
                        index={i}
                        key={i}
                        onClick={setTabIndex}
                    >
                        {text}
                    </TabTitleButton>)
                }
            </TitleContainer>

            {props.children[tabIndex]}
        </Container>
    )
}

export { TabView };

