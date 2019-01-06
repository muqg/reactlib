import * as React from "react";

const REACT_DEV_MODE = "_self" in React.createElement("i")

interface Props {
    children: React.ReactNode
}


function Unstable({children}: Props) {
    if(!REACT_DEV_MODE)
        return null

    return (
        <React.StrictMode>
            {children}
        </React.StrictMode>
    )
}


export { Unstable };

