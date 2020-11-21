import {ComponentType, FunctionComponent} from "react"
import {Notify} from "../components/component-types"
import {useNotify} from "../hooks"
import {getDisplayName} from "../utility/react"

export interface NotificationComponentProps {
  notify: Notify
}

function withNotify<P extends NotificationComponentProps>(
  Component: ComponentType<P>
) {
  const wrapper: FunctionComponent<Omit<
    P,
    keyof NotificationComponentProps
  >> = (props) => {
    const notify = useNotify()
    // @ts-ignore Correct but not compatible with expected return type.
    return <Component {...props} notify={notify} />
  }

  wrapper.displayName = getDisplayName("withNotify", Component)

  return wrapper
}

export {withNotify}
