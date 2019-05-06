import * as React from "react"

interface Props {
  children: React.ReactNode
}

function Unstable({children}: Props) {
  if (__DEV__) {
    return <>{children}</>
  }

  return null
}

export {Unstable}
