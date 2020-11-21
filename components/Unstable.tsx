import {ReactNode} from "react"

interface Props {
  children: ReactNode
}

function Unstable({children}: Props) {
  if (__DEV__) {
    return <>{children}</>
  }

  return null
}

export {Unstable}
