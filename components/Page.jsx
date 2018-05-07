import * as React from "react"

/*const Page = ({children}) => (
    <div id="mainContainer">
        <div id="contentContainer">
            {children}
        </div>
    </div>
)*/

const Page = ({children, header, footer}) => (
    <div>
        {header}
        {children}
        {footer}
    </div>
)


export default Page
