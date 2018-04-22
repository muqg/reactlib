import * as React from "react"
import "../../css/tabs.css"

const Button = ({text, classes = [], attributes}) => (
    <button className={classes.push(".l_tab_button").join(" ")} {...attributes}>
        {text}
    </button>
)

export default Button