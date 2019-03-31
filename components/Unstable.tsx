import * as React from "react"

interface Props {
    children: React.ReactNode
}

function Unstable({children}: Props) {
    if (__DEV__) {
        return <React.StrictMode>{children}</React.StrictMode>
    }

    return null
}

export {Unstable}
