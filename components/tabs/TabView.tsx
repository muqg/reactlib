import * as React from "react"
import {useState, useEffect} from "react"
import {styled} from "../../styles"
import {isFunction} from "../../utility/assertions"
import {Tab} from "./Tab"
import {TabTitleButton} from "./TabTitleButton"
import {isComponentType} from "../../utility/react"

const Container = styled.div`
    width: 100%;
`
const TitleContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 36px;
`

interface Props {
    children: React.ReactElement<Tab>[]
    className?: string
}

function TabView({children, className}: Props) {
    const [tabIndex, setTabIndex] = useState(0)

    if (__DEV__) {
        useEffect(() => {
            children.forEach((child, index) => {
                if (!isComponentType(child, Tab)) {
                    console.error(
                        `TabView's child ${index + 1} is not of Tab type.`
                    )
                }
            })
        }, [])
    }

    const titles = children
        .map(
            c =>
                !c.props.hidden &&
                (isFunction(c.props.title) ? c.props.title() : c.props.title)
        )
        .filter(c => c)

    return (
        <Container className={className}>
            {titles.length > 1 && (
                <TitleContainer>
                    {titles.map((text, i) => (
                        <TabTitleButton
                            active={tabIndex === i}
                            index={i}
                            key={i}
                            onClick={setTabIndex}
                        >
                            {text}
                        </TabTitleButton>
                    ))}
                </TitleContainer>
            )}

            {children[tabIndex]}
        </Container>
    )
}

export {TabView}
