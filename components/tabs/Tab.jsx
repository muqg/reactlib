import * as React from "react"
import "../../css/tabs.css"

const Tab = ({children, classes, attributes}) => (
    <div className={classes.push(".l_tab_button").join(" ")} {...attributes}>
        {children}
    </div>
)

export default Tab