import {ReactElement, ComponentType, FunctionComponent} from "react"

/**
 * Determines whether a react element is of a given component type.
 */
function isComponentType<T>(
  element: ReactElement<T>,
  component: ComponentType<any> | FunctionComponent<any>
): element is ReactElement<T> {
  // child.type === Tab does not currently work with react-hot-loader
  // and therefore the code below is used as a workaround.
  const isType = element.type === component
  const isMatchingName =
    // @ts-ignore displayName exists on all React types.
    element.type.displayName === (component.displayName || component.name)

  return isType || isMatchingName
}

export {isComponentType}
