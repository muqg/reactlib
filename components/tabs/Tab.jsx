import * as React from "react"
import "../../css/tabs.css"

const Tab = ({children, className, attributes}) => (
    <div className={["l_tab", className].join(" ")} {...attributes}>
        {children}
    </div>
)

export default Tab