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
    margin-bottom: 12px;
    ${flex()}
`


interface Props {
    children: React.ReactElement<Tab>[]
    className?: string
}


function TabView({children, className}: Props) {
    const [tabIndex, setTabIndex] = useState(0)

    const titles = children.map(
        c => !c.props.hidden && (isFunction(c.props.title) ? c.props.title() : c.props.title)
    ).filter(c => c)

    return (
        <Container className={className}>
            {titles.length > 1 &&
                <TitleContainer>
                    {titles.map((text, i) =>
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
            }

            {children[tabIndex]}
        </Container>
    )
}

export { TabView };

