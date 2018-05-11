import * as React from "react"

const Page = ({children, header, footer}) => (
    <div>
        {header}
        {children}
        {footer}
    </div>
)


export default Page
