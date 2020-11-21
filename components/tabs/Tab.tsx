import {FunctionComponent, ReactNode} from "react"

interface Tab {
  children?: ReactNode
  className?: string
  /**
   * Used by TabView to determine whether to show the tab or not.
   */
  hidden?: boolean
  /**
   * The text or element to be displayed inside the tab button.
   */
  title: string | (() => ReactNode)
}

const Tab: FunctionComponent<Tab> = (props: Tab) => {
  return <div className={props.className}>{props.children}</div>
}

export {Tab}
