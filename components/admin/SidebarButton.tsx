import * as React from "react"
import truncate from "../../utility/string/truncate";

interface Props {
    text: string
    href?: string
    attributes?: object
}

const BUTTON_TEXT_LENGTH = 16

const SidebarButton = ({text, href = "#", attributes}: Props) =>  {
    const limited = truncate(text, BUTTON_TEXT_LENGTH)
    const title = limited !== text ?  text : ""

    return (
        <li className="l_sidebar_element" title={title}>
            <a href={href} {...attributes}>
                {limited}
            </a>
        </li>
    )
}

export default SidebarButton