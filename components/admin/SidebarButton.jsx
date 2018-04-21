import * as React from "react"
import { limitString } from "../../utility"

const BUTTON_TEXT_LENGTH = 16

const SidebarButton = ({text, href = "#", attributes}) =>  {
    const limited = limitString(text, BUTTON_TEXT_LENGTH)
    const title = limited !== text ?  text : null

    return (
        <li className="l_sidebar_element" title={title}>
            <a href={href} {...attributes}>
                {limited}
            </a>
        </li>
    )
}

export default SidebarButton