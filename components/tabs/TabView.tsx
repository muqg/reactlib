import {ReactElement, useEffect, useState} from "react"
import {styled} from "../../styles"
import {isFunction} from "../../utility/assertions"
import {isComponentType} from "../../utility/react"
import {Grid} from "../Grid"
import {View} from "../View"
import {Tab} from "./Tab"
import {TabTitleButton} from "./TabTitleButton"

const TitleContainer = styled(Grid)`
  margin-bottom: 32px;
`

interface Props {
  children: ReactElement<Tab>[]
  className?: string
}

function TabView({children, className}: Props) {
  const [tabIndex, setTabIndex] = useState(0)

  if (__DEV__) {
    useEffect(() => {
      children.forEach((child, index) => {
        if (!isComponentType(child, Tab)) {
          console.error(`TabView's child ${index + 1} is not of Tab type.`)
        }
      })
    }, [])
  }

  const titles = children
    .map(
      (c) =>
        !c.props.hidden &&
        (isFunction(c.props.title) ? c.props.title() : c.props.title)
    )
    .filter((c) => c)

  return (
    <View className={className}>
      {titles.length > 1 && (
        <TitleContainer horizontalAlign="center">
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
    </View>
  )
}

export {TabView}
